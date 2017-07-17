<? php 
if (isset($_POST['name'])) $name = $_POST['name'];
else $name = "(Not entered)";
?>
<!DOCTYPE html>
<html lang="en">

<head>
	<title>mänhsturs</title>

	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css?family=Barrio" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
	<link rel="stylesheet" href="index.css">
</head>


<body>
	<div class="wrapper">
		<div class="page-header">
			<div class="container">
				<div class="row">
					<div class="title pull-left">
					<a href="index.html"><h1>Mänhsturs</h1></a>
					</div>
					<div class="controls pull-right">
					<a href="play.html"><button class="btn btn-default">PLAY</button></a>
					<a href="form.html"><button class="btn btn-default">SIGN UP</button></a>
					</div>
				</div>
			</div>
		</div>
		
		 
			<div class="jumbotron">
				 <div class="container">
					 	<h2>KEEP TRACK OF YOUR PROGRESS! CREATE AN ACCOUNT!</h2>
						Your name is: <?= $name; ?><br>
				<form method="post" action="form.php"> 
				What is your name?
				
					<div class="form-group">
					<label for="name">Name:</label>
					<input type="text" class="form-control" id="name">
				  </div>
				  <div class="form-group">
					<label for="email">Email address:</label>
					<input type="email" class="form-control" id="email">
				  </div>
				  <div class="form-group">
					<label for="pwd">Password:</label>
					<input type="password" class="form-control" id="pwd">
				  </div>
				  <div class="checkbox">
					<label><input type="checkbox"> Remember me</label>
				  </div>
				  <button type="submit" class="btn btn-default #change-color">Submit</button>
				</form>
				</div>
			</div>




<nav class="page-footer navbar navbar-default navbar-fixed-bottom">
			<div class="container">
				<span>Copyright &copy;2017</span> 
				<span>Mänhsturs</span>
				<span>All Rights Reserved.</span>
			</div>
</nav>


	
	

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
		
	

</body>

</html>
	