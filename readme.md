## This is a simple Notes API

### Creating a notes
POST /create
```
{
    "username": "your_username",
    "title": "note_title",
    "content": "note_content",
    "author": "author_name"
}
```


### Updating a note
PUT /update/<username>
```
[
    {
        "title": "old_note_title",
        "content": "old_note_content"
    },
    {
        "title": "new_note_title",
        "content": "new_note_content"
    }
]
```
### Deleting a note
DELETE /delete/<username>
```
{
    "title": "note_title"
}
```
### Listing notes
GET /list/<username>
