# Admin API Usage Guide

This document shows how to use the centralized admin API functions from `src/services/adminApi.js` in your admin components.

## Importing Functions

Instead of using raw axios calls, import the specific functions you need:

```javascript
// Import only what you need
import { getAdminNews, createNews, deleteNews } from '@/services/adminApi'

// Or import multiple functions
import { 
  getAdminNews, 
  getAdminNewsById, 
  createNews, 
  updateNews, 
  deleteNews 
} from '@/services/adminApi'
```

## News Management Example

```javascript
// Fetch news list with filters
const fetchNews = async () => {
  const params = {
    page: 1,
    limit: 10,
    search: 'keyword',
    category: 'academic',
    status: 'published'
  }
  
  const response = await getAdminNews(params)
  if (response.success) {
    console.log(response.data.news)
  }
}

// Get single news article
const getSingleNews = async (id) => {
  const response = await getAdminNewsById(id)
  if (response.success) {
    console.log(response.data)
  }
}

// Create news
const createNewsArticle = async () => {
  const formData = new FormData()
  formData.append('title', 'My News Title')
  formData.append('content', 'News content here...')
  formData.append('category', 'academic')
  formData.append('status', 'published')
  formData.append('featured_image', fileInput.files[0]) // optional
  
  const response = await createNews(formData)
  if (response.success) {
    alert('News created!')
  }
}

// Update news
const updateNewsArticle = async (id) => {
  const formData = new FormData()
  formData.append('title', 'Updated Title')
  formData.append('content', 'Updated content')
  // ... other fields
  
  const response = await updateNews(id, formData)
  if (response.success) {
    alert('News updated!')
  }
}

// Delete news
const deleteNewsArticle = async (id) => {
  const response = await deleteNews(id)
  if (response.success) {
    alert('News deleted!')
  }
}
```

## Comments Management Example

```javascript
import { getAdminComments, updateCommentStatus, deleteComment } from '@/services/adminApi'

// Get all comments with filters
const fetchComments = async () => {
  const params = {
    page: 1,
    limit: 20,
    status: 'pending', // or 'approved', 'rejected'
    news_id: 123 // optional - filter by specific news
  }
  
  const response = await getAdminComments(params)
  if (response.success) {
    console.log(response.data.comments)
  }
}

// Approve/reject comment
const approveComment = async (id) => {
  const response = await updateCommentStatus(id, { status: 'approved' })
  if (response.success) {
    alert('Comment approved!')
  }
}
```

## Photo Gallery Management Example

```javascript
import { 
  createAlbum, 
  addPhotoToAlbum, 
  deleteAlbum 
} from '@/services/adminApi'

// Create album
const createPhotoAlbum = async () => {
  const formData = new FormData()
  formData.append('title', 'Album Title')
  formData.append('description', 'Album description')
  formData.append('cover_image', coverFile) // optional
  
  const response = await createAlbum(formData)
  if (response.success) {
    console.log('Album created:', response.data)
  }
}

// Add photo to album
const addPhoto = async (albumId, photoFile) => {
  const formData = new FormData()
  formData.append('photo', photoFile)
  formData.append('caption', 'Photo caption')
  
  const response = await addPhotoToAlbum(albumId, formData)
  if (response.success) {
    alert('Photo added!')
  }
}
```

## Contact Messages Example

```javascript
import { getAdminContacts, updateContactStatus } from '@/services/adminApi'

// Get all contact messages
const fetchContacts = async () => {
  const params = {
    page: 1,
    status: 'new' // or 'read', 'replied'
  }
  
  const response = await getAdminContacts(params)
  if (response.success) {
    console.log(response.data.messages)
  }
}

// Mark as read
const markAsRead = async (id) => {
  const response = await updateContactStatus(id, { status: 'read' })
  if (response.success) {
    alert('Marked as read!')
  }
}
```

## Error Handling

All functions return the response from the API. Always check for success:

```javascript
try {
  const response = await getAdminNews()
  
  if (response.success) {
    // Handle success
    console.log(response.data)
  } else {
    // Handle API error
    console.error(response.message)
  }
} catch (error) {
  // Handle network or other errors
  console.error('Error:', error)
}
```

## Available Functions

### News Management
- `getAdminNews(params)` - Get news list
- `getAdminNewsById(id)` - Get single news
- `createNews(formData)` - Create news
- `updateNews(id, formData)` - Update news
- `deleteNews(id)` - Delete news

### School Profile
- `createSchoolProfile(data)` - Create profile key
- `updateSchoolProfile(key, data)` - Update profile value
- `deleteSchoolProfile(key)` - Delete profile key

### Comments
- `getAdminComments(params)` - Get comments
- `getAdminCommentById(id)` - Get single comment
- `updateCommentStatus(id, data)` - Update status
- `deleteComment(id)` - Delete comment
- `getCommentStats(newsId)` - Get stats for news

### Videos
- `createVideo(data)` - Create video
- `updateVideo(id, data)` - Update video
- `deleteVideo(id)` - Delete video

### Photo Galleries
- `getAdminAlbumById(id)` - Get album
- `createAlbum(formData)` - Create album
- `updateAlbum(id, formData)` - Update album
- `deleteAlbum(id)` - Delete album
- `addPhotoToAlbum(albumId, formData)` - Add photo
- `updatePhoto(id, formData)` - Update photo
- `deletePhoto(id)` - Delete photo
- `reorderPhotos(albumId, data)` - Reorder photos

### Contact Messages
- `getAdminContacts(params)` - Get messages
- `getContactStats()` - Get message stats
- `getAdminContactById(id)` - Get single message
- `updateContactStatus(id, data)` - Update status
- `deleteContact(id)` - Delete message

## Benefits

✅ **Reusability** - Import and use the same functions across all admin components
✅ **Type Safety** - JSDoc comments provide autocomplete and documentation
✅ **Consistency** - All admin API calls follow the same pattern
✅ **Maintainability** - Update API endpoints in one place
✅ **Error Handling** - Centralized error handling and auth token injection
