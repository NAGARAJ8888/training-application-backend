# File Upload Guide - Videos & PPTs

Complete guide for uploading videos and presentations with file handling.

## Overview

Admins can upload video files and PowerPoint presentations directly from their local computer. Files are stored on the server and accessible via secure URLs.

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Create upload directories** (auto-created on first upload):
- `uploads/videos/` - Video files
- `uploads/ppts/` - PPT/PDF files

3. **Restart server:**
```bash
npm run start:dev
```

## File Upload Endpoints

### Upload Video (Admin Only)

**Endpoint:** `POST /api/videos/upload`

**Authorization:** Bearer token (Admin role required)

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` (required) - Video file
- `title` (required) - Video title
- `duration` (required) - Video duration (e.g., "10:30")
- `type` (required) - "module" or "basic"
- `moduleId` (optional) - Module identifier
- `moduleName` (optional) - Module name

**Accepted Formats:**
- MP4, AVI, MOV, WMV, FLV, MKV, WebM
- Max size: 500MB

**Example using curl:**
```bash
curl -X POST http://localhost:3000/api/videos/upload \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "file=@/path/to/video.mp4" \
  -F "title=Introduction to NestJS" \
  -F "duration=15:30" \
  -F "type=module" \
  -F "moduleId=mod123" \
  -F "moduleName=Backend Basics"
```

**Example using Postman:**
1. Set method to `POST`
2. URL: `http://localhost:3000/api/videos/upload`
3. Headers: `Authorization: Bearer YOUR_ADMIN_TOKEN`
4. Body → form-data:
   - Key: `file`, Type: File, Value: Select your video
   - Key: `title`, Type: Text, Value: "My Video"
   - Key: `duration`, Type: Text, Value: "10:30"
   - Key: `type`, Type: Text, Value: "module"

**Response:**
```json
{
  "id": "673f8e2d4b8c9a1234567890",
  "title": "Introduction to NestJS",
  "duration": "15:30",
  "type": "module",
  "moduleId": "mod123",
  "moduleName": "Backend Basics",
  "fileUrl": "/uploads/videos/a1b2c3d4-e5f6-7890-abcd-ef1234567890.mp4",
  "fileName": "video.mp4",
  "fileSize": 52428800,
  "mimeType": "video/mp4",
  "createdAt": "2025-11-10T12:00:00.000Z",
  "updatedAt": "2025-11-10T12:00:00.000Z"
}
```

---

### Upload PPT (Admin Only)

**Endpoint:** `POST /api/ppts/upload`

**Authorization:** Bearer token (Admin role required)

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` (required) - PPT/PPTX/PDF file
- `title` (required) - Presentation title
- `slides` (required) - Number of slides
- `moduleId` (required) - Module identifier
- `moduleName` (optional) - Module name

**Accepted Formats:**
- PPT, PPTX, PDF
- Max size: 50MB

**Example using curl:**
```bash
curl -X POST http://localhost:3000/api/ppts/upload \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "file=@/path/to/presentation.pptx" \
  -F "title=Database Design" \
  -F "slides=25" \
  -F "moduleId=mod123" \
  -F "moduleName=Backend Basics"
```

**Response:**
```json
{
  "id": "673f8e2d4b8c9a1234567891",
  "title": "Database Design",
  "slides": 25,
  "moduleId": "mod123",
  "moduleName": "Backend Basics",
  "fileUrl": "/uploads/ppts/b2c3d4e5-f6a7-8901-bcde-f12345678901.pptx",
  "fileName": "presentation.pptx",
  "fileSize": 5242880,
  "mimeType": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "createdAt": "2025-11-10T12:05:00.000Z",
  "updatedAt": "2025-11-10T12:05:00.000Z"
}
```

---

## Accessing Files

### Get All Videos

**Endpoint:** `GET /api/videos`

**Authorization:** Bearer token (any authenticated user)

**Query Parameters:**
- `type` - Filter by type ("module" or "basic")
- `moduleId` - Filter by module ID

**Examples:**
```bash
# Get all videos
GET /api/videos

# Get module videos only
GET /api/videos?type=module

# Get videos for specific module
GET /api/videos?moduleId=mod123
```

### Stream Video

**Endpoint:** `GET /api/videos/:id/stream`

**Authorization:** Bearer token

**Description:** Stream video file directly

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/videos/673f8e2d4b8c9a1234567890/stream \
  --output video.mp4
```

### Get All PPTs

**Endpoint:** `GET /api/ppts`

**Authorization:** Bearer token

**Query Parameters:**
- `moduleId` - Filter by module ID

**Example:**
```bash
# Get all PPTs
GET /api/ppts

# Get PPTs for specific module
GET /api/ppts?moduleId=mod123
```

### Download PPT

**Endpoint:** `GET /api/ppts/:id/download`

**Authorization:** Bearer token

**Description:** Download PPT file

**Example:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/ppts/673f8e2d4b8c9a1234567891/download \
  --output presentation.pptx
```

---

## Update with New File

### Update Video (Admin Only)

**Endpoint:** `PATCH /api/videos/:id`

**Authorization:** Bearer token (Admin role required)

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` (optional) - New video file
- `title` (optional) - New title
- `duration` (optional) - New duration
- `type` (optional) - New type
- `moduleId` (optional) - New module ID

**Example:**
```bash
curl -X PATCH http://localhost:3000/api/videos/673f8e2d4b8c9a1234567890 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "file=@/path/to/new_video.mp4" \
  -F "title=Updated Title"
```

### Update PPT (Admin Only)

**Endpoint:** `PATCH /api/ppts/:id`

**Authorization:** Bearer token (Admin role required)

**Example:**
```bash
curl -X PATCH http://localhost:3000/api/ppts/673f8e2d4b8c9a1234567891 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "file=@/path/to/new_presentation.pptx" \
  -F "title=Updated Title"
```

---

## Delete Files

### Delete Video (Admin Only)

**Endpoint:** `DELETE /api/videos/:id`

**Authorization:** Bearer token (Admin role required)

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/videos/673f8e2d4b8c9a1234567890 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Delete PPT (Admin Only)

**Endpoint:** `DELETE /api/ppts/:id`

**Authorization:** Bearer token (Admin role required)

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/ppts/673f8e2d4b8c9a1234567891 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## File Storage

### Local Storage

Files are stored in:
- **Videos:** `uploads/videos/`
- **PPTs:** `uploads/ppts/`

Files are named with UUID to prevent conflicts:
- Original: `my-video.mp4`
- Stored as: `a1b2c3d4-e5f6-7890-abcd-ef1234567890.mp4`

### File Access

Files are accessible via:
```
http://localhost:3000/uploads/videos/filename.mp4
http://localhost:3000/uploads/ppts/filename.pptx
```

**Note:** These URLs require authentication for production use.

---

## Error Handling

### Common Errors

**No file uploaded:**
```json
{
  "statusCode": 400,
  "message": "Video file is required",
  "error": "Bad Request"
}
```

**Invalid file type:**
```json
{
  "statusCode": 400,
  "message": "Only video files are allowed!",
  "error": "Bad Request"
}
```

**File too large:**
```json
{
  "statusCode": 413,
  "message": "File too large",
  "error": "Payload Too Large"
}
```

**Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Forbidden (not admin):**
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

---

## Testing with Postman

### Setup Collection

1. **Create environment variables:**
   - `base_url`: `http://localhost:3000/api`
   - `admin_token`: Your admin JWT token
   - `user_token`: Your user JWT token

2. **Upload Video:**
   - Method: `POST`
   - URL: `{{base_url}}/videos/upload`
   - Headers: `Authorization: Bearer {{admin_token}}`
   - Body: form-data with file and fields

3. **Get Videos:**
   - Method: `GET`
   - URL: `{{base_url}}/videos`
   - Headers: `Authorization: Bearer {{user_token}}`

---

## Frontend Integration

### React Example (with Axios)

```javascript
import axios from 'axios';

const uploadVideo = async (file, videoData) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', videoData.title);
  formData.append('duration', videoData.duration);
  formData.append('type', videoData.type);
  formData.append('moduleId', videoData.moduleId);

  const response = await axios.post(
    'http://localhost:3000/api/videos/upload',
    formData,
    {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        console.log(`Upload progress: ${progress}%`);
      }
    }
  );

  return response.data;
};

// Usage in component
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  
  const videoData = {
    title: 'My Video',
    duration: '10:30',
    type: 'module',
    moduleId: 'mod123'
  };

  try {
    const result = await uploadVideo(file, videoData);
    console.log('Upload successful:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### HTML Form Example

```html
<form id="uploadForm" enctype="multipart/form-data">
  <input type="file" name="file" accept="video/*" required>
  <input type="text" name="title" placeholder="Title" required>
  <input type="text" name="duration" placeholder="Duration (10:30)" required>
  <select name="type" required>
    <option value="module">Module</option>
    <option value="basic">Basic</option>
  </select>
  <input type="text" name="moduleId" placeholder="Module ID">
  <button type="submit">Upload Video</button>
</form>

<script>
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  
  const response = await fetch('http://localhost:3000/api/videos/upload', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + adminToken
    },
    body: formData
  });
  
  const result = await response.json();
  console.log('Upload result:', result);
});
</script>
```

---

## Security Considerations

### Production Recommendations

1. **File validation:**
   - ✅ File type checking
   - ✅ File size limits
   - ✅ Virus scanning (recommended)

2. **Storage:**
   - Consider cloud storage (AWS S3, Google Cloud Storage)
   - Implement CDN for better performance
   - Add file encryption for sensitive content

3. **Access control:**
   - Files require authentication
   - Implement role-based file access
   - Add download tracking/analytics

4. **Optimization:**
   - Video transcoding for multiple formats
   - Thumbnail generation
   - Compression

---

## Troubleshooting

### File not uploading

1. Check file size (< 500MB for videos, < 50MB for PPTs)
2. Verify file format is supported
3. Ensure `Content-Type: multipart/form-data` header
4. Check admin token is valid

### Cannot access uploaded files

1. Verify uploads directory exists
2. Check file permissions
3. Ensure server is running
4. Check file URL in response

### Out of disk space

1. Monitor uploads directory size
2. Implement file cleanup strategy
3. Consider cloud storage migration

---

## Summary

✅ Admin can upload videos (MP4, AVI, MOV, etc.)
✅ Admin can upload PPTs (PPT, PPTX, PDF)
✅ Files stored locally with UUID names
✅ All users can view/stream files
✅ Only admin can upload/update/delete
✅ File metadata stored in MongoDB
✅ Proper error handling and validation

**Ready to upload!** 🚀

