# Dermatify

## How to run project

### Prerequisites

To run this project, ensure you meet the following prerequisites:

1. You must be a member of Dermatify with access to the Dermatify GCP project.
2. Install `gcloud CLI`.

### Steps

Follow these steps to run the project:

1. Request access to the Dermatify GCP project from the developers.
2. Clone this repository using `git clone https://github.com/dermatify/dermatify-be.git`.
3. Install dependencies by running `npm install`.
4. Authenticate using `gcloud auth application-default login`.
5. Start the development server with `npm run dev`.
6. Congratulations! You've successfully ran the project.

## Endpoints

### Register

1. `POST` to endpoint `/auth/register` with the body:

**Request**

```
{
    "name": "John Doe",
    "email": "johndoe@email.com",
    "password": "StringPassword123"
}
```

**Response**

```
{
    "message": "User created!"
}
```

**Error Responses**

```
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "User already exists!"
}
```

```
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "Name, username, and password are required fields!"
}
```

```
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "Email is invalid!"
}
```

```
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "Password must be longer than 8 characters!"
}
```

```
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "Password must contain lowercase, uppercase, and numbers!"
}
```

### Login

2. `POST` to endpoint `/auth/login` with the body:

**Request**

```
{
    "email": "johndoe@email.com",
    "password": "StringPassword123"
}
```

**Response**

```
{
    "refreshTtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhcHNraWVoQGdtYWlsLmNvbSIsImlhdCI6MTcxNzUxOTI2OCwiZXhwIjoxNzE4MTI0MDY4fQ.oNrbW1R6KB26Y0tSNPo7piLmcjtx5okV4uFviGpoS_k",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhcHNraWVoQGdtYWlsLmNvbSIsImlhdCI6MTcxNzUxOTI2OCwiZXhwIjoxNzE3NTIwMTY4fQ.cjCclDEPwKcdMpRkDALWKFOYER0OsiV7K_3omLq-rG8"
}
```

**Error Responses**

```
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "User not found!"
}
```

```
{
    "statusCode": 401,
    "error": "Unauthorized",
    "message": "Invalid credentials!"
}
```

### Logout

3. `POST` to endpoint `/auth/logout` with the header:

**Request Header**
Bearer Token Authentication with `Access token`

**Response**

```
{
    "message": "User logged out!"
}
```

**Error Responses**

```
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "User not found!"
}
```

```
{
    "statusCode": 401,
    "error": "Unauthorized",
    "message": "Invalid token!"
}
```

### Logout

4. `POST` to endpoint `/auth/renew` with the header:

**Request Header**
Bearer Token Authentication with `Refresh token`

**Response**

```
{
    "message": "Access token updated!",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhcHNraWVoQGdtYWlsLmNvbSIsImlhdCI6MTcxNzUxOTI2OCwiZXhwIjoxNzE3NTIwMTY4fQ.cjCclDEPwKcdMpRkDALWKFOYER0OsiV7K_3omLq-rG8"
}
```

**Error Responses**

```
{
    "statusCode": 400,
    "error": "Bad Request",
    "message": "User not found!"
}
```

```
{
    "statusCode": 401,
    "error": "Unauthorized",
    "message": "Invalid token!"
}
```

### Edit Profile

5. `PUT` to endpoint `/user/profile` with the body:

**Request Body**

```
{
    "name": "Test Name"
}
```

**Request Header**
Bearer Token Authentication with `Access token`

**Response**

```
{
    "hashedPassword": "$2a$10$vZ0BdUBEHYMHDDdrFMuvf.x45wHA/8NFpVwlftwFfGh8BDWTFlt/u",
    "name": "Test Name",
    "picture": null,
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhcHNraWVoQGdtYWlsLmNvbSIsImlhdCI6MTcxODE5Njk1MywiZXhwIjoxNzE4MTk3ODUzfQ.8ST4LBQRUH3hW04-cUjR7tplQw3eoJElFNT7KhVGm6o",
    "isActive": true,
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhcHNraWVoQGdtYWlsLmNvbSIsImlhdCI6MTcxODE5Njk1MywiZXhwIjoxNzE4ODAxNzUzfQ.c_g3XX8LPlibQLMDwfTLZw2PNctgb9QkNwhLV-9O4aE"
}
```

### Fetch Articles

6. `GET` to endpoint `/article` with the headers:

**Request Header**
Bearer Token Authentication with `Access token`

**Response**

```
{
  "data": [
    {
      "id": 4,
      "title": "The Future of Skin Rejuvenation: Trends and Treatments in 2024",
      "subtitle": "The latest trends and treatments that are shaping the future of skin rejuvenation",
      "date": "2024-05-11",
      "original_link": "https://molechex.com.au/2024/05/11/the-future-of-skin-rejuvenation-trends-and-treatments-in-2024/",
      "thumbnail": "https://molechex.com.au/wp-content/uploads/2024/05/the-future-of-skin-rejuvenation-trends-and-treatments-in-2024.jpg"
    },
    {
      "id": 2,
      "title": "The 24 Best Skincare Products for Neutralizing Redness",
      "subtitle": "This article highlights skincare products that effectively reduce skin redness, including serums and lotions designed for sensitive and irritated skin.",
      "date": "2024-05-08",
      "original_link": "https://www.realsimple.com/best-skincare-products-for-redness-7499631",
      "thumbnail": "https://www.realsimple.com/thmb/im6A40CE-YRd2xrkZ52P0avDkQQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/RS-best-anti-redness-products-tout-8d88720acf08487988a523fd0747b9b4.jpg"
    },
      ....
               ]
}
```

**Error Responses**

```
{
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "An internal server error occurred"
}
```

### Predict
7. `POST` to endpoint `/predict` with the request body `multiform/form-data` and headers:

#### Request Body
Content-Type: multipart/form-data

Request file example:

By uploading an image file

**Request Header**
Bearer Token Authentication with `Access token`

#### Example of response body
```
{
    "status": "success",
    "message": "Model predicted successfully.",
    "data": {
        "id": "66d9e80e-7800-4c4a-9ac7-d1a709fa954b",
        "createdAt": "2024-06-20T17:49:19.523Z",
        "issue": "Redness",
        "score": 0.5003900527954102
    }
}
```


**Error Responses**
Failed Scenario:
User upload image more than 1MB
```
{
    "status": "fail",
    "message": "Payload content length greater than maximum allowed: 1000000"
}
```

