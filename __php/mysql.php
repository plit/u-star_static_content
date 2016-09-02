<?php

require_once 'functions.php';

class SQL
{

	/**
	 * SELECT
	 * @param string $sql
	 * @param string $k array key = $k value
	 * @return array(0 => ..., 1 => ...)
	 */
	public static function sqlArray($sql, $k = '') {
		klog(__FUNCTION__, "sql = $sql --- \$k = $k");
		return self::getSqlQueryResult($sql, 'array', $k);
	}

	/**
	 * SELECT
	 * @param string $sql
	 * @return array('xxx' => 'yyy')
	 */
	public static function sqlRow($sql) {
		klog(__FUNCTION__, "sql = $sql");
		return self::getSqlQueryResult($sql, 'row');
	}

	/**
	 * INSERT, UPDATE, DELETE
	 * @param string $sql
	 * @return Ambigous <string, mixed>
	 */
	public static function sqlRun($sql) {
		klog(__FUNCTION__, "sql = $sql");
		return self::getSqlQueryResult($sql);
	}

	private static function getSqlQueryResult($sql, $type = '', $k = '') {		
				
		$result = mysql_query($sql);
		if (!$result) {
			klog(__FUNCTION__, "Error: " . mysql_error());
			echo "Error: sql";
			return array();
		}
		
		$return = array();
		if ($type === 'row') {
			$return = mysql_fetch_assoc($result);
		}
		elseif ($type === 'array') {
			$is_key = $k != '';
			while (false != $row = mysql_fetch_assoc($result)) {
				if ($is_key) {
					$return[$row[$k]] = $row;
				}
				else {
					$return[] = $row;
				}
			}
		}
		else {
			if (strpos($sql, 'INSERT INTO') !== false) {
				$return = array(
						'result' => $result,
						'id' => mysql_insert_id()
				);
			}
			else {
				$return = $result;
			}
		}
		return $return;
	}
}

?>