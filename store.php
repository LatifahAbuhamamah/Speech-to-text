<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $transcription = $_POST['transcription'];

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "speech_to_text";

  
        $conn = new mysqli($servername, $username, $password, $dbname);
    
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
    
        // Prepare and bind the statement
        $stmt = $conn->prepare("INSERT INTO speech_text (text) VALUES ($transcription)");
        $stmt->bind_param("s", $transcription);
    
        // Execute the statement
        if ($stmt->execute()) {
            echo "Transcription stored successfully";
        } else {
            echo "Error storing transcription: " . $stmt->error;
        }
    
        $stmt->close();
        $conn->close();
    }
    ?>
    

