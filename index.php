<?
error_reporting(E_ERROR);
$db = new SQLite3('data/DB.sqlite'); 


if($_GET['pub']) $WHERE = "WHERE publisher='".$_GET['pub']."'";
$result = $db->query("SELECT * FROM articles $WHERE ORDER BY gmt DESC");//->fetchArray(SQLITE3_ASSOC); 


include('lib/header.html');

?> 
<link rel="stylesheet" type="text/css" href="style/base.css">
<link rel="stylesheet" type="text/css" href="style/list.css">
<?
$date = '';
 while($item = $result->fetchArray(SQLITE3_ASSOC)){ 
	$newdate = date('l, j. F Y', strtotime($item['gmt']));
	if($newdate != $date){
		echo "<time>$newdate</time>";
		$date = $newdate;
	}
 	?>
<section>
 	<img class='publogo' src='logos/<?=$item['publisher']?>.png' onclick='document.location.search="?pub=<?=$item['publisher']?>"'/>
 	<h1 onclick='window.open("<?=$item['url']?>");'><?=$item['title']?></h1>
 	<p><?=$item['abstract']?></p>
</section>
  <? } 
echo "</article>";

?>

<!-- 
// $db = sqlite_open('data/DB');
 	// <time><?=date('l, j. F Y, H:i', strtotime($item['gmt']))?></time>

// $query = $db->query('SELECT * FROM articles'); 

// while ($entry = $query->fetch(SQLITE_ASSOC)) {
	// print_r($entry);
// }
 -->