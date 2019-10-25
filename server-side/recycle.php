<?php
$method = $_SERVER['REQUEST_METHOD'];
$servername = "mysql-sh202888.super-host.pl";
$username = "db100043794";
$password = "EkoApp.rr14";
$dbname = "db100043794";

$conn = mysqli_connect($servername, $username, $password, $dbname);
$conn->set_charset("utf8");

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "";
switch ($method)
{
    case 'POST':
        $name = $_POST['name'];
        $score = $_POST['score'];
        $sql = "INSERT INTO `Scores`(`Name`, `Score`) VALUES ('$name', $score) ON DUPLICATE KEY UPDATE Score=$score;";
        break;
    case 'GET':
        $sql = "SELECT recItems.*, recCats.CatName, recCats.Color from recItems left outer join recCats on (recCats.ID=recItems.Category) ORDER BY Searches DESC";
        break;
}
$response = mysqli_query($conn, $sql);
if (!$response) {
    http_response_code(404);
    die(mysqli_error());
}

if ($method == 'GET')
{
    header('Content-Type: application/json');
	echo "[";
	$i = 0;
    if (mysqli_num_rows($response) > 0) {
		//echo (json_encode(mysqli_fetch_assoc($response)))."\n";
        while($row = mysqli_fetch_assoc($response)) {
		    echo json_encode($row, JSON_UNESCAPED_UNICODE);
			if ($i != mysqli_num_rows($response) - 1)
				echo ",\n";
			$i++;
	    }
	echo "]";
    } else {
        echo "{}";
    }
}

mysqli_close($conn);

function utf8ize($mixed) {
    if (is_array($mixed)) {
        foreach ($mixed as $key => $value) {
            $mixed[$key] = utf8ize($value);
        }
    } else if (is_string ($mixed)) {
        return utf8_encode($mixed);
    }
    return $mixed;
}
?>