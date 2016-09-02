<?php

// Include RS configuration
require_once 'conf.php';
require_once 'base.php';
//require_once 'MobSong.php';
//require_once 'MobLike.php';
//require_once 'MobCompetition.php';

// error_reporting(E_PARSE);
// error_reporting ( E_ALL );
//error_reporting ( E_ALL ^ E_NOTICE );
//ini_set ( "display_errors", true );

/**
 * Mobile API Class - provides functions for mobile
 */
class Web_API extends Base
{

	private $_eid = 0;

	public function __construct()
	{
		if (empty($_REQUEST)) {
			echo "Error: missing request attributes!";
			die();
		}
		//parent::__construct();

		$params = explode('/', $_GET['kohana_uri']);
		//print_r($params);
		if (!empty($params[2])) {
			$this->_eid = $params[2];
		}

		klog('__construct', $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"] . '<--' . $_SERVER["REQUEST_METHOD"]);
		klog(__METHOD__, $_REQUEST);

	}

	private function getSong()
	{
		$entry_id = MysqlEscapeString($this->_eid);
		if (!empty($entry_id)) {
			$sql = "SELECT ce.*, s.* FROM song s
				JOIN competition_entry ce ON ce.song_id=s.song_id
				WHERE  ce.entry_id = '" . $entry_id . "'";

			$row = $this->sqlRow($sql);
			if (!empty($row['song_id'])) {
				return $row;
			} else {
				return array();
			}
		} else {
			return array();
		}
	}

	public function replaceFacebookMeta($source)
	{
		$song = $this->getSong();
		$play_url = Url::getPlayUrl($song);
		$img_url = Url::getVideoImgUrl($song);
		$meta_data = array(
			'og:url' => $play_url,
			'og:type' => 'website',
			'og:title' => 'title',
			'og:description' => 'description',
			'og:image' => $img_url
		);
		$replace = '';

		foreach ($meta_data as $k => $v) {
			$replace .= '<meta property="' . $k . '" content="' . $v . '" />' . "\n\t";
		}

		$str = str_replace('<!-- FB meta -->', $replace, $source);

		if (!empty($this->_eid) && empty($_GET['eid'])) {
			$replace = "<script>window.location = '?go=demo&eid=11';</script>";
			$str = str_replace('<!-- redirect -->', $replace, $str);
		}

		return $str;
	}


}


