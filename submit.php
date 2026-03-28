<?php
// submit.php

// Helper function to send JSON response
function jsonResponse($success, $message) {
    header('Content-Type: application/json');
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

// Only allow POST requests
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    jsonResponse(false, 'Only POST requests are allowed.');
}

// Configuration
$toEmail = 'info@therootaccessnetwork.com'; // CHANGE THIS TO YOUR EMAIL
$fromEmail = 'noreply@info@therootaccessnetwork.comnetwork.com'; // CHANGE THIS TO A VALID SENDER EMAIL ON YOUR SERVER

// Get form data
$formType = $_POST['form_type'] ?? 'contact'; // 'contact', 'newsletter', 'get-involved'
$name = $_POST['name'] ?? 'N/A';
$email = $_POST['email'] ?? '';
$message = $_POST['message'] ?? '';
$subject = $_POST['subject'] ?? 'New Form Submission';
$interest = $_POST['interest'] ?? '';

// Basic validation
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(false, 'Please provide a valid email address.');
}

// Construct Email Content based on form type
$emailSubject = "New Submission: " . ucfirst(str_replace('-', ' ', $formType));
$emailBody = "";

$emailBody .= "New submission from your website:\n\n";
$emailBody .= "Type: " . ucfirst($formType) . "\n";
if ($name !== 'N/A') $emailBody .= "Name: $name\n";
$emailBody .= "Email: $email\n";

if ($formType === 'get-involved') {
    $emailBody .= "Interest: $interest\n";
}

if ($formType === 'contact' && !empty($subject)) {
    $emailBody .= "Subject Option: $subject\n";
}

if (!empty($message)) {
    $emailBody .= "\nMessage:\n$message\n";
}

$headers = "From: $fromEmail" . "\r\n" .
           "Reply-To: $email" . "\r\n" .
           "X-Mailer: PHP/" . phpversion();

// Send Email
if (mail($toEmail, $emailSubject, $emailBody, $headers)) {
    if ($formType === 'newsletter') {
        jsonResponse(true, 'Thank you! You have been subscribed.');
    } else {
        jsonResponse(true, 'Thank you! Your message has been sent successfully.');
    }
} else {
    jsonResponse(false, 'Sorry, something went wrong. Please try again later.');
}
?>