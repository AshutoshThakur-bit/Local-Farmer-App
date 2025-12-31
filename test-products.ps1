# Test script to fetch products and add sample products

# First, let's get all products
Write-Host "Fetching products from API..."
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/products" -Method Get
Write-Host "Response: $(($response | ConvertTo-Json -Depth 5))"
Write-Host "Number of products: $($response.Count)"

if ($response.Count -eq 0) {
    Write-Host "No products found. Adding sample products..."
    
    # First register and login as a farmer
    $registerBody = @{
        name = "Farmer John"
        email = "farmer@example.com"
        password = "password123"
    } | ConvertTo-Json
    
    $regResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "Register response: $regResponse"
    
    # Login
    $loginBody = @{
        email = "farmer@example.com"
        password = "password123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "Login response: $loginResponse"
    $token = $loginResponse.token
    
    # Add a product
    $productBody = @{
        title = "Fresh Organic Tomatoes"
        description = "High-quality farm-grown tomatoes"
        price = 40
        stock = 100
        image = "https://via.placeholder.com/300x300?text=Tomatoes"
    } | ConvertTo-Json
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $productResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/products/create" -Method Post -Body $productBody -Headers $headers
    Write-Host "Product creation response: $productResponse"
}
