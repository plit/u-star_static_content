<?
//phpinfo();
ini_set("display_errors", "1");
error_reporting(E_ALL | E_STRICT);
/* */

$content = '';

$filename = __DIR__ . '/../u-star_static_content/i.html';
if (file_exists($filename)) {
	$fc = file_get_contents($filename);
	if (!empty($fc)) {
		$content = $fc;
	}
}

if (!empty($content) && strpos($content, '?>') != FALSE) {
	ob_start();
	eval('?>' . $content);
	$data = ob_get_clean();
	$content = $data;
}


if (empty($_GET["kohana_uri"]) || $_GET["kohana_uri"] == '/i' || $_GET["kohana_uri"] == '/i/') {

	echo $content;

} else {

	//var_dump($_GET["kohana_uri"]);
	//var_dump(strpos($_GET["kohana_uri"], '/play/'));

	if (strpos($_GET["kohana_uri"], '/play/') === 0) {

		require_once '__php/main.php';
		$Web_API = new Web_API();
		$c = $Web_API->replaceFacebookMeta($content);

		echo $c;
	} else {
		echo 'U-Star';
	}
}
