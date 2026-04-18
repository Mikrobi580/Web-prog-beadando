<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

$host = "localhost";
$db = "pizza_db";
$user = "root";
$pass = "";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8mb4",
        $user,
        $pass,
        array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION)
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array("error" => "Nem sikerult kapcsolodni az adatbazishoz."));
    exit;
}

function readJsonBody() {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);
    return is_array($data) ? $data : array();
}

function sendJson($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    $stmt = $pdo->query(
        "SELECT p.nev, p.kategorianev, p.vegetarianus, k.ar
         FROM pizza p
         LEFT JOIN kategoria k ON k.nev = p.kategorianev
         ORDER BY p.nev"
    );
    sendJson($stmt->fetchAll(PDO::FETCH_ASSOC));
}

if ($method === "POST") {
    $input = readJsonBody();
    $nev = trim($input["nev"] ?? "");
    $kategorianev = trim($input["kategorianev"] ?? "");
    $vegetarianus = !empty($input["vegetarianus"]) ? 1 : 0;

    if ($nev === "" || $kategorianev === "") {
        sendJson(array("error" => "A nev es a kategoria megadasa kotelezo."), 422);
    }

    $stmt = $pdo->prepare(
        "INSERT INTO pizza (nev, kategorianev, vegetarianus)
         VALUES (:nev, :kategorianev, :vegetarianus)"
    );
    $stmt->execute(array(
        ":nev" => $nev,
        ":kategorianev" => $kategorianev,
        ":vegetarianus" => $vegetarianus
    ));

    sendJson(array("message" => "Pizza hozzaadva."), 201);
}

if ($method === "PUT") {
    $input = readJsonBody();
    $eredetiNev = trim($input["eredetiNev"] ?? $input["nev"] ?? "");
    $nev = trim($input["nev"] ?? "");
    $kategorianev = trim($input["kategorianev"] ?? "");
    $vegetarianus = !empty($input["vegetarianus"]) ? 1 : 0;

    if ($eredetiNev === "" || $nev === "" || $kategorianev === "") {
        sendJson(array("error" => "Hianyzo modositasi adat."), 422);
    }

    $stmt = $pdo->prepare(
        "UPDATE pizza
         SET nev = :nev, kategorianev = :kategorianev, vegetarianus = :vegetarianus
         WHERE nev = :eredetiNev"
    );
    $stmt->execute(array(
        ":nev" => $nev,
        ":kategorianev" => $kategorianev,
        ":vegetarianus" => $vegetarianus,
        ":eredetiNev" => $eredetiNev
    ));

    sendJson(array("message" => "Pizza modositva."));
}

if ($method === "DELETE") {
    $input = readJsonBody();
    $nev = trim($input["nev"] ?? "");

    if ($nev === "") {
        sendJson(array("error" => "A torlendo pizza neve hianyzik."), 422);
    }

    $stmt = $pdo->prepare("DELETE FROM pizza WHERE nev = :nev");
    $stmt->execute(array(":nev" => $nev));

    sendJson(array("message" => "Pizza torolve."));
}

sendJson(array("error" => "Nem tamogatott keres."), 405);
?>
