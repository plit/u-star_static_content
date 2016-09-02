<?php

require_once 'mysql.php';

function loadSysIni() {
	// define path
	$rs_sys_php_file = __DIR__ . '/_sys.ini.php';
	
	//$count_ini_tmp = substr_count(file_get_contents($rs_sys_php_file . '.template'), "\n");
	//$count_ini = substr_count(@file_get_contents($rs_sys_php_file), "\n");
	//
	//// require define
	//if (is_file($rs_sys_php_file) && $count_ini_tmp == $count_ini ) {
		require_once $rs_sys_php_file;
	//}
	//else {
	//	klog("--> does not exist or content faulty <-- '$rs_sys_php_file'");
	//	die('Create a template file from ' . $rs_sys_php_file .'.template --content copy to--> '. $rs_sys_php_file . ' <-- add svn ignore ' .
	//	"\n<br />" . "$count_ini_tmp == $count_ini rows");
	//}
}

function MysqlEscapeString($ertek) {
	return mysql_escape_mimic($ertek);
	/*if (get_magic_quotes_gpc())
		$ertek = stripslashes($ertek);
	$ertek = mysql_real_escape_string($ertek);
	return $ertek;*/
}

function mysql_escape_mimic($inp) {
    if(is_array($inp))
        return array_map(__METHOD__, $inp);

    if(!empty($inp) && is_string($inp)) {
        return str_replace(array('\\', "\0", "\n", "\r", "'", '"', "\x1a"), array('\\\\', '\\0', '\\n', '\\r', "\\'", '\\"', '\\Z'), $inp);
    }

    return $inp;
} 
/**
 * SELECT
 * @param string $sql
 * @param string $k array key = $k value
 * @return array(0 => ..., 1 => ...)
 */
function sqlArray($sql, $k = '') {
	return SQL::sqlArray($sql, $k);
}
/**
 * SELECT
 * @param string $sql
 * @return array('xxx' => 'yyy')
 */
function sqlRow($sql) {
	return SQL::sqlRow($sql);
}
/**
 * INSERT, UPDATE, DELETE
 * @param string $sql
 * @return Ambigous <string, mixed>
 */
function sqlRun($sql) {
	return SQL::sqlRun($sql);
}

function callCurlGet($uri, $headers = '') {
	klog(__FUNCTION__, $uri);
	if (empty($headers)) {
		$headers = array();
	}
	$finalHeaders = array();
	foreach ($headers as $header => $content) {
		if (is_string($header)) {
			$finalHeaders[] = $header . ': ' . $content;
		}
		else {
			$finalHeaders[] = $content;
		}
	}
	
	$cookie_file = "/tmp/php_curl.cookie";
	$curl = curl_init($uri);
	curl_setopt($curl, CURLOPT_URL, $uri);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($curl, CURLOPT_HEADER, false);
	curl_setopt($curl, CURLOPT_TIMEOUT, 300);
	curl_setopt($curl, CURLOPT_HTTPHEADER, $finalHeaders);
	curl_setopt($curl, CURLOPT_HTTPGET, 1);
	$content = curl_exec($curl);
	
	return $content;

}

/**
 * curl segitsegevel hiv meg egy linket
 * @param string $url
 * @param array $fields
 * @param array $set_cookie ex."fruit=apple; colour=red"
 * @param boolean $is_log true log on, false log off
 * @return mixed
 */
function callCurlPost($url, $fields, $set_cookie = '', $is_log = true) {
	if ($is_log) {
		klog(__FUNCTION__, array(
			$url, 
			$fields
		));
	}
	
	$is_file = false;
	$fields_string = "";
	foreach ($fields as $key => $value) {
		$fields_string .= $key . '=' . urlencode($value) . '&';
		if (preg_match("/^@.*/i", $value)) {
			$is_file = true;
		}
	}
	rtrim($fields_string, '&');
	if ($is_file) {
		// multipart/form-data
		$fields_string = $fields;
	}
	
	$cookie_file = "/tmp/php_curl.cookie";
	$curl = curl_init();
	
	curl_setopt($curl, CURLOPT_HTTPHEADER, array(
		'Expect:'
	));
	
	curl_setopt($curl, CURLOPT_HEADER, false);
	curl_setopt($curl, CURLOPT_COOKIEJAR, $cookie_file);
	if (!empty($set_cookie))
		curl_setopt($curl, CURLOPT_COOKIE, $set_cookie);
	curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (X11; Linux x86_64; rv:5.0) Gecko/20100101 Firefox/5.0 FirePHP/0.5");
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
	
	curl_setopt($curl, CURLOPT_POST, true);
	curl_setopt($curl, CURLOPT_POSTFIELDS, $fields_string);
	
	curl_setopt($curl, CURLOPT_URL, $url);
	$content = curl_exec($curl);
	
	curl_close($curl);
	return $content;

}

function callCurlPostAsync($url, $params) {
	foreach ($params as $key => &$val) {
		if (is_array($val))
			$val = implode(',', $val);
		$post_params[] = $key . '=' . urlencode($val);
	}
	$post_string = implode('&', $post_params);
	
	$parts = parse_url($url);
	
	$fp = fsockopen($parts['host'], isset($parts['port']) ? $parts['port'] : 80, $errno, $errstr, 30);
	
	$out = "POST " . $parts['path'] . " HTTP/1.1\r\n";
	$out .= "Host: " . $parts['host'] . "\r\n";
	$out .= "Content-Type: application/x-www-form-urlencoded\r\n";
	$out .= "Content-Length: " . strlen($post_string) . "\r\n";
	$out .= "Connection: Close\r\n\r\n";
	if (isset($post_string))
		$out .= $post_string;
	
	fwrite($fp, $out);
	fclose($fp);
}


$_is_logging = true;
$klog_file = '_klog'; //basename(__FILE__);
$klog_file_dir = realpath(__DIR__ . '/../') . '/log/';//die($klog_file_dir);
if (!is_dir($klog_file_dir)) {
	mkdir($klog_file_dir);
}
/**
* include
* //require_once '../conf.php';
* //$klog_file = basename(__FILE__);
* //klog('------------------------------');
* using
* klog(__FUNCTION__, "return: uploaded_file_name???");
* @param string $name
* @param string $content
*/
function klog($name, $content = '') {
	global $_is_logging;
	global $klog_file;
	global $klog_file_dir;
	if (!$_is_logging) {
		return;
	}
	if (empty($content)) {
		$content = $name;
		$name = '';
	}
	// file_put_contents(basename(__FILE__) .'_' . $name . '_.log', $content . "\n\n", FILE_APPEND);
	//$s = '																		--' . $_SERVER['HTTP_X_CLUSTER_CLIENT_IP'] . '--';
	$content = is_array($content) ? print_r($content, true) : $content;
	//file_put_contents(basename(__FILE__) . '_.log', $s . $name . ' - ' . date("Y-m-d H:i:s") . "-->\n" . $content . "\n", FILE_APPEND);
	

	$k_log_array_format = true;
	$k_log_call_path = true;
	$class_tabs = 30;
	$text_tabs = 80;
	$class_tabs_a = $class_tabs + 28;
	$replace = ($k_log_array_format) ? "\n" . sprintf("%-{$class_tabs_a}s", "") : '';
	$order = ($k_log_array_format) ? "\n" : array("\r\n", "\n", "\r", "\t\t\t");
	$content = str_replace($order, $replace, $content);
	
	$gccf = sprintf("%-{$class_tabs}s", "$name") . ' --> ';
	
	$get_called = '';
	$debug_b = current(debug_backtrace());
	if ($k_log_call_path) {
		$get_called = "\t\t" . ' <-- ' . $debug_b['file'] . ':' . $debug_b['line'];
		if (substr($content, -2) === "  ") {
			$get_called = sprintf("%-80s", "\t") . $get_called;
		}
		$content = sprintf("%-{$text_tabs}s", "$content");
	}
	$klog_file_rel = $klog_file_dir . $klog_file;
	file_put_contents($klog_file_rel . '_.log', date('Y-m-d H:i:s') . ' -- ' . $gccf . $content . $get_called . "\n", FILE_APPEND);
}

$RunExec_echo = array();

/**
* A hiba kimenet átirányítva a standard kimenetre és azt adja vissza tömb formában
* @param string $exec_string
* @param string $debug_description
* @return array kimenet
*/
/*function runExec($exec_string, $debug_description = '') {
	global $RunExec_echo;
	if (!empty($debug_description)) {
		$RunExec_echo[] = $debug_description . "\n";
	}
	$RunExec_echo[] = 'php_exec: ' . $exec_string;
	exec($exec_string . ' 2>&1', $output);
	$RunExec_echo[] = "Output: \n" . @implode("\n", $output) . "\n" . "\n";
	return $output;
}/**/

function strToSoundex($str) {
	$soundex_array = explode(' ', $str);
	if (empty($soundex_array))
		return '';
	foreach ($soundex_array as $sa) {
		$sox[] = soundex($sa);
	}
	return implode(' ', $sox);
}

///
/// Checks filename contains onyl digits
///
function isOnlyDigit($fileName) {
	if (!preg_match('/^[0-9]{1,}/', $fileName))
		return false;
	return true;
}

///
/// Checking kareoke file. Filename must be the following style: integer_integer
///
function checkKaraokeFile($fileName) {
	if (!preg_match('/^([0-9]+)_([0-9]+)$/', $fileName))
		return false;
	return true;
}

///
/// Validating user id. ID must be an integer
///
function checkUserId($id) {
	if (!preg_match('/^[0-9]{1,}/', $id))
		return false;
	return true;
}

///
/// Validating filetype. Type must be mp4 or flv
///
function checkFileType($type) {
	$fileType = array(
		"mp4", 
		"flv"
	);
	if (!in_array($type, $fileType))
		return false;
	return true;
}

/**
 * remove "\r\n", "\r" and trim
 * @param string $input
 * @return string
 */
function cleanAndTrim($input) {
	//return $input;
	$return = str_replace(array(
		"\r\n", 
		"\r"
	), "", $input);
	return trim($return);
}

function getNewSongName() {
	return date('Ymd_Hms').rand(100,999);
}

/**
* jogosultsagok
* @param string $db_privilegies
* @param string $search
* @return boolean
	*/
function isPrivilegies($db_privilegies, $search) {
	$privilegies = explode(",", $db_privilegies);
	
	if (in_array($search, $privilegies)) {
		return true;
	}
	return false;
}

/**
 * A hiba kimenet átirányítva a standard kimenetre és azt adja vissza tömb formában
 * @param string $exec_string
 * @param string $debug_description
 * @return array kimenet
 */
function runExec($exec_string, $debug_description = '') {
	if (!empty($debug_description)) {
				klog(__FUNCTION__, $debug_description);
	}
				klog(__FUNCTION__, 'php_exec: ' . $exec_string . ' 2>&1');
	exec($exec_string . ' 2>&1', $output);
				klog(__FUNCTION__, "Output: \n" . @implode("\n", $output));
	return $output;
}

class GenTime
{
	private $start_times = array();

	function start($level = 0){

		if (!empty($this->start_times[$level])) {
			return;
		}
		$time = microtime();
		$time = explode(' ',$time);
		$time = $time[1] + $time[0];
		$this->start_times[$level] = $time;
	}

	function end($level = 0){
		$time = microtime();
		$time = explode(' ',$time);
		$time = $time[1] + $time[0];
		$gentime = ($time - $this->getVal($level))*1000;
		$gentime = number_format($gentime, 3, ',', '.');
		unset($this->start_times[$level]);
		return ' '.$gentime."ms";
	}

	private function getVal($level) {
		return (!empty($this->start_times[$level])) ? $this->start_times[$level] : null;

	}

	function is_started($level = 0) {
		$val = $this->getVal($level);
		return (!empty($val)) ? true : false;
	}
}
$GenTime = new GenTime();

/**
 * futás időtartama
 * genTime(0) //start ->
 * 		...
 * 		genTime(1) //start ->
 * 		...
 * 		genTime(1) //<- end - start ->
 * 		...
 * 		genTime(1) //<- end - start ->
 * 		...
 * genTime(0) //<- end - start ->
 * 
 * @param number $level
 */
 function genTime($level = 0) {
	global $GenTime;
	if (!$GenTime->is_started($level)) {
		$GenTime->start($level);
		klog(__FUNCTION__, "[$level] start");
		return;
	}
	$time = $GenTime->end($level);
	klog(__FUNCTION__, str_repeat(" ", 20) . "[$level] $time <- end - start ->");
	$GenTime->start($level);
	//klog(__FUNCTION__, "[$level] start");
}

/**
 * 
 * @param string $file
 * @return NULL|boolean
 */
function hasVideo($file) {
	if (!file_exists($file)) {
		klog(__FUNCTION__, "isVideo -- !file_exists($file)");
		return null;
	}
	$output = runExec("/var/www/mplayer -vo null -ao null -frames 0 -identify $file | grep ID_VIDEO_CODEC= | cut -d= -f2,3 | head -1", "isVideo($file)");
	$hasVideo = (!empty($output[0]) && $output[0] == 'ffh264') ? true : false;
	return $hasVideo;
}

$lang_lang_array_values = '';

function lang($str_in) {
	global $lang_lang_array_values;
	$lang_array = array();
	
	if (empty($lang_lang_array_values)) {
		$lang_file_path = _DIR_LOG . "lang_tab.lan";
		
		if (!file_exists($lang_file_path) || filectime($lang_file_path) <= (time() - 3600)) {
			
			$langs = array('en', 'th', 'hu', 'my', 'ph', 'cebuanoph');
			$sql = "SELECT def, " . implode(", ", $langs) . " FROM lang l INNER JOIN competition_tabs ct ON ct.name=l.def GROUP BY l.def";
			
			$result = sqlArray($sql);
			
			$file_array = array();
			foreach($result as $r) {
				foreach($langs as $l) {
					$file_array[$l][$r['def']] = $r[$l];
				}
			}
			
			file_put_contents($lang_file_path, json_encode($file_array));
		}
		
		$lang_array = json_decode(file_get_contents($lang_file_path), true);
		
		$lang_lang_array_values = $lang_array;
	}
	else {
		$lang_array = $lang_lang_array_values;
	}
	
	
	return empty($lang_array['en'][$str_in]) ? $str_in : $lang_array['en'][$str_in];
}

if (!function_exists( "array_sort_by_column" )) {
	/**
	 *
	 * @param array &$arr
	 * @param strng $col
	 * @param dif $dir SORT_ASC, SORT_DESC, SORT_REGULAR, SORT_NUMERIC, SORT_STRING
	 */
	function array_sort_by_column(&$arr, $col, $dir = SORT_ASC) {
		$sort_col = array();
		foreach ($arr as $key=> $row) {
			$sort_col[$key] = $row[$col];
		}

		array_multisort($sort_col, $dir, $arr);
	}
}

if (!function_exists( "array_limit" )) {
	/**
	 *
	 * @param array $arr
	 * @param int $page 1, 2, ...
	 * @param int $limit
	 * @return array
	 */
	function array_limit($arr, $page, $limit) {
		$page = (int)$page - 1;
		$page = ($page < 0) ? 0 : $page;
		$offset = $page * (int)$limit;
		return array_slice($arr, $offset, $limit);
	}
}



if (!function_exists( "flash_ios" )) {
    /**
     * 
     * @param number $limit flasjh values
     */
    function flash_ios($limit = 2) {
        for ($i = 0; $i < $limit; $i++){
            echo str_repeat(' ',1024*64);  	
            flush();
            ob_flush();
        }
        ob_end_flush();
    }
}






loadSysIni();
?>