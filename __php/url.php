<?php

class Url
{
	public static 
		$site_url = 'http://www.risingstars.asia/',
		$base_url = 'http://mobile.risingstars.asia/bases/mp4bases/',
		$user_photo_url = 'http://images.risingstars.asia/photos/users/',
		$user_profile_url = 'http://images.risingstars.asia/photos/users/',
		
		$cdn_base_url = 'http://92d6c8845ea467fee8c8-f722e710656201ef4f8db35a071cf1b2.r10.cf1.rackcdn.com/',
		$cdn_video_url = 'http://92daf3fcc1683be45a94-849cdfd04b0704cd2d7d1147b6ec63c5.r37.cf1.rackcdn.com/',
		$cdn_user_photo_url = 'http://ea14401dadf0497fa2d3-9952b805c835b14a9d3e5205a34dbad3.r71.cf1.rackcdn.com/';

	function __construct() {
		//klog('__construct', $_REQUEST);
	}

	public static function getVideoImgUrl($song) {
		if (!empty($song['user_id'])) {
			return self::$cdn_video_url . 'ustar/' . $song['user_id'] . '/' . $song['s_file_name'] . '.jpg';
		}
		return 'http://73adc0e8ebac205046b3-f166d868b29010bc304fe7760b66a9b0.r88.cf1.rackcdn.com/img/backgrounds/shine.png';
	}

	public static function getPlayUrl($song) {
		if (!empty($song['entry_id'])) {
			return _SITE_URL . 'play/' . $song['entry_id'];
		}
		return _SITE_URL . 'play';
	}




	
	public static function getProfileUrl() {
		return self::$site_url . 'profile/';
	}
	
	/**
	 * 
	 * @param int $user_id
	 * @param string $username
	 * @param array $song play résznek kell
	 * @return string
	 */
	public static function getUserProfileUrl($user_id, $username = '', $song = '') {
		$return = self::getProfileUrl() . $user_id . (!empty($username) ? '/' . urlencode($username) : '');
		if (!empty($song)) {
			$return .= '/' . self::playerTag($song);
		}
		return $return;
	}
	
	
	public static function playerTag($song) {
		$songData = $song;
		$sid = '';
		if (!is_array($songData)) {
			$songData = array('song_id' => $song);
			$sid = $songData['song_id'];
		}
	
		/*if (is_array($songData) && empty($songData['song']) && !empty($songData['song_id'])) {
			$sid = $songData['song_id'];
			$model = new \RS\Page\Model\Song();
			$songData = $model->get($sid);
			// @todo better error handling
			if (!$songData) {
				$songData = array(
				'song_id' => $sid,
				'song' => ''
				);
				$sid = $songData['song_id'];
			}
		}*/
	
		if (empty($songData['song_id'])) {
			$songData['song_id'] = $sid;
		}
		if (empty($songData['song'])) {
			$songData['song'] = '';
		}
		if (is_array($songData['song'])){
			//echo 'x';
		}
	
		$song_url = strip_tags(strtolower($songData['song']));
		$song_url = preg_replace('([^A-z0-9])', '-', $song_url);
		$song_url = substr($song_url, 0, 40);
		return 'play/' . $songData['song_id'] . ($song_url ? '/' . $song_url : '');
	}
	
}

?>