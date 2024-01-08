<?php

//Retrieve form data.
//GET - user submitted data using AJAX
//POST - in case user does not support javascript, we'll use POST instead
$name = ($_GET['name']) ? $_GET['name'] : $_POST['name'];
$email = ($_GET['email']) ?$_GET['email'] : $_POST['email'];
$subject = ($_GET['subject']) ?$_GET['subject'] : $_POST['subject'];
$message = ($_GET['message']) ?$_GET['message'] : $_POST['message'];

//flag to indicate which method it uses. If POST set it to 1
if ($_POST) $post=1;
//recipient - change this to your name and email
$to = $name . ' <' . 'inan@inankardeslerotel.com' . '>';
//sender
$from = $name . ' <' . $email . '>';

//subject and the html message
$s = 'Comment from ' . $name;
$msg = '
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head></head>
    <body>
    <table>
        <tr><td>Name</td><td>' . $name . '</td></tr>
        <tr><td>Email</td><td>' . $email . '</td></tr>
        <tr><td>Subject</td><td>' . $subject . '</td></tr>
        <tr><td>Message</td><td>' . nl2br($message) . '</td></tr>
    </table>
    </body>
    </html>';

//send the mail
$result = sendmail($to, $s, $msg, $from);

//if POST was used, display the message straight away
if ($_POST) {
	if ($result) echo 'Thank you! We have received your message.';
	else echo 'Sorry, unexpected error. Please try again later';

	//else if GET was used, return the boolean value so that
	//ajax script can react accordingly
	//1 means success, 0 means failed
} else {
	echo $result;
}

//Simple mail function with HTML header
function sendmail($to, $s, $msg, $from) {
	$headers = "MIME-Version: 1.0" . "\r\n";
	$headers .= "Content-type:text/html;charset=utf-8" . "\r\n";
	$headers .= 'From: ' . $from . "\r\n";

	$result = mail($to,$s,$msg,$headers);

	if ($result) return 1;
	else return 0;
}
?>