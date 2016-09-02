<?php

class Base
{
	private static $_instance = null;
	private static $_is_baseLog = true;
	
	protected static $_is_logging = true;
	protected static $_user_country_code = null;
	

	function __construct() {
		// set user country code
		$user_ip = $this->getUserIpAddress();
		if (IS_TEST) {
			self::$_user_country_code = 'PH';
		}
		else {
			// Live -
			if (isset($_GET['ip_filtering_country'])) {
				self::$_user_country_code = $_GET['ip_filtering_country'];
			} else {
				$site_url = URL::$site_url;
				self::$_user_country_code = file_get_contents($site_url . 'ph/w_clear_log/mobileGeoIPCheck.php?ip=' . $user_ip);
			}
		}
		$this->baseLog($user_ip);
	}
	
	private function baseLog($user_ip) {
		if (!self::$_is_baseLog){
			return;
		}
		self::$_is_baseLog = false;
		klog(__METHOD__, $_REQUEST);
		klog(__METHOD__, "_user_country_code = " . self::$_user_country_code . ", ip = $user_ip, is test = " . (IS_TEST? 1 : 0));
	}
	
	/**
	 * @return MobileBase
	 */
	public static function getInstance() {
		$isNew = false;
		if (!self::$_instance || $isNew) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	/**
	 * Function to make safe a data
	 *
	 * @param string $data
	 * @param string $encoding
	 * @return string
	 */
	function xsSafe($data, $encoding = 'UTF-8') {
		
		// Strip HTML tags from data
		$tmp = preg_replace('/<[^>]*>/', ' ', $data);
		
		// Filter for special html characters ENT_QUOTES|ENT_HTML401
		return htmlspecialchars($tmp, 3 | 0, $encoding);
	}

	function xsSafeComment($data, $encoding = 'UTF-8') {
		return preg_replace('/<[^>]*>/', ' ', $data);
	}

	/**
	 * Safe version of echo
	 *
	 * @param unknown $data
	 */
	function xEcho($data) {
		echo xsSafe($data);
	}

	/**
	 * Checks param contains only digits
	 */
	function isOnlyDigit($param) {
		if (!preg_match('/^[0-9]{1,}/', $param))
			return false;
		return true;
	}

	private static function filePutContentLog($name, $content = '') {
		if (!self::$_is_logging) {
			return;
		}
		if (empty($content)) {
			$content = $name;
			$name = '';
		}
		klog($name, $content);
		return;
		// file_put_contents(basename(__FILE__) .'_' . $name . '_.log', $content . "\n\n", FILE_APPEND);
		$s = '																		--' . $_SERVER['HTTP_X_CLUSTER_CLIENT_IP'] . '--';
		$content = is_array($content) ? print_r($content, true) : $content;
		file_put_contents(basename(__FILE__) . '_.log', $s . $name . ' - ' . date("Y-m-d H:i:s") . "-->\n" . $content . "\n", FILE_APPEND);
	}

	/**
	 * SELECT
	 * @param string $sql
	 * @param string $k array key = $k value
	 * @return array(0 => ..., 1 => ...)
	 */
	protected function sqlArray($sql, $k = '') {
		return sqlArray($sql, $k);
	}

	/**
	 * SELECT
	 * @param string $sql
	 * @return array('xxx' => 'yyy')
	 */
	protected function sqlRow($sql) {
		return sqlRow($sql);
	}

	/**
	 * INSERT, UPDATE, DELETE
	 * @param string $sql
	 * @return Ambigous <string, mixed>
	 */
	protected function sqlRun($sql) {
		return sqlRun($sql);
	}

	protected function getUserIpAddress() {
		return (empty($_GET['user_ip_address'])) ? 
					(!empty($_SERVER['HTTP_X_CLUSTER_CLIENT_IP']) ? $_SERVER['HTTP_X_CLUSTER_CLIENT_IP'] : $_SERVER['REMOTE_ADDR']) 
					: trim($_GET['user_ip_address']);
	}

	/**
	 * Write result to output
	 *
	 * @param unknown $result
	 */
	protected function writeResult($result) {
		klog(__FUNCTION__, $result);
		
		header('Access-Control-Allow-Origin: *');
		echo $result;
	}
	
	/**
	 * *
	 * Check voting is facebook based or not
	 */
	protected function checkNormalHash($user_email, $password, $client_hash) {
		// HASH(email + HASH(password))
		$server_hash = sha1($user_email . sha1($password));
        klog(__FUNCTION__, array($user_email, $password, $client_hash, $server_hash));
		if ($server_hash != $client_hash) {
			// failed;
			return 0;
		}
	
		return 1;
	}
	
	/**
	 *
	 * @param unknown $array
	 */
	protected function echoJson($array) {
		header('Cache-Control: no-cache, must-revalidate');
		header('Content-type: application/json');
		echo json_encode($array);
	}
	
	
}


?>