import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';


const findCommentById = (comments, targetId) => {
  for (const comment of comments) {
    if (comment.id === targetId) return comment;
    if (comment.replies) {
      const found = findCommentById(comment.replies, targetId);
      if (found) return found;
    }
  }
  return null;
};

export const fetchBlogs = createAsyncThunk(
  'blogs/fetchBlogs',
  async (url = 'blog/posts/', thunkAPI) => {
    try {
      // If it's a full URL (next page), strip the base
      const relativeUrl = url.startsWith('http')
        ? url.replace(`${import.meta.env.VITE_API_BASE_URL}/`, '') // adjust if needed
        : url;

      const response = await axiosInstance.get(relativeUrl);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error fetching blogs');
    }
  }
);


export const fetchCurrentUserBlogs = createAsyncThunk('blog/fetchCurrentUserBlogs', async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('blog/my-posts/');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Error fetching blogs');
    }
  });


export const fetchSingleBlog = createAsyncThunk('blog/fetchSingleBlog', async (id, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`blog/posts/${id}/`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Error fetching blog');
  }
});

export const createBlog = createAsyncThunk('blog/createBlog', async (blogData, thunkAPI) => {
  try {
    const response = await axiosInstance.post('blog/posts/', blogData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Error creating blog');
  }
});

export const updateBlog = createAsyncThunk('blog/updateBlog', async ({ id, blogData }, thunkAPI) => {
  try {
    const response = await axiosInstance.patch(`blog/posts/${id}/`, blogData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Error updating blog');
  }
});

export const deleteBlog = createAsyncThunk('blog/deleteBlog', async (id, thunkAPI) => {
  try {
    await axiosInstance.delete(`blog/posts/${id}/`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Error deleting blog');
  }
});

export const toggleBlogLike = createAsyncThunk('blog/toggleBlogLike', async (blogId, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`blog/${blogId}/like/`);
    return{blogId, message: response.data.message};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Error toggling blog like');
  }
});

export const markBlogAsRead = createAsyncThunk('blog/markAsRead', async (blogId, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`blog/${blogId}/read/`);
    return { blogId, message: response.data.message };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Error marking as read');
  }
});

export const addComment = createAsyncThunk('blog/addComment', async ({ blogId, content, parentCommentId }, thunkAPI) => {
  try {
    const data = {content};
    if (parentCommentId) {
      data.parent_comment = parentCommentId;
    }
    const response = await axiosInstance.post(`blog/${blogId}/comment/`, data);
    return { blogId, comment: response.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Error adding comment');
  }
});

export const deleteComment = createAsyncThunk('blog/deleteComment', async ({blogId, commentId}, thunkAPI) => {
  try {
    await axiosInstance.delete(`blog/comment/${commentId}/delete/`);
    return {blogId, commentId};
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || 'Error deleting comment');
  }
});


const blogSlice = createSlice({
  name: 'blogs',
  initialState: {
    blogs: [],
    next: null,
    currentUserBlogs: [],
    blog: null,
    loading: false,
    error: null,
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false,
  },
  reducers: {
    resetBlogState: (state) => {
      state.blog = null;
      state.error = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        const { results, next } = action.payload;
      
        const isFirstPage = !action.meta.arg || action.meta.arg.includes('page=1') || action.meta.arg === 'blog/';
      
        if (isFirstPage) {
          state.blogs = results;
        } else {
          const existingIds = new Set(state.blogs.map((b) => b.id));
          const newBlogs = results.filter((b) => !existingIds.has(b.id));
          state.blogs = state.blogs.concat(newBlogs);
        }
      
        state.next = next;
        state.loading = false;
      })
      
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single
      .addCase(fetchSingleBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blog = action.payload;
      })
      .addCase(fetchSingleBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.createSuccess = false;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.unshift(action.payload);
        state.currentUserBlogs.unshift(action.payload);
        state.createSuccess = true;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.updateSuccess = false;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        state.blogs = state.blogs.map(blog => blog.id === action.payload.id ? action.payload : blog);
        state.currentUserBlogs = state.currentUserBlogs.map(blog => blog.id === action.payload.id ? action.payload : blog);
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.deleteSuccess = false;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteSuccess = true;
        state.blogs = state.blogs.filter(blog => blog.id !== action.payload);
        state.currentUserBlogs = state.currentUserBlogs.filter(blog => blog.id !== action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentUserBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUserBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUserBlogs = action.payload;
      })
      .addCase(fetchCurrentUserBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.log('Error fetching current user blogs:', action.payload);
        
      })
      .addCase(toggleBlogLike.fulfilled, (state, action) => {
        const { blogId } = action.payload;
        const updatedBlog = state.blogs.find(b => b.id === blogId);
        if (updatedBlog) {
          updatedBlog.like_count += updatedBlog.is_liked ? -1 : 1;
          updatedBlog.is_liked = !updatedBlog.is_liked;
        }
      })
      .addCase(markBlogAsRead.fulfilled, (state, action) => {
        const { blogId } = action.payload;
        const blog = state.blogs.find(b => b.id === blogId);
        if (blog && !blog.is_read) {
          blog.read_count += 1;
          blog.is_read = true;
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { blogId, comment } = action.payload;
        const blog = state.blogs.find(b => b.id === blogId);
        if (blog) {
          if (comment.parent_comment) {
            const parentComment = findCommentById(blog.comments, comment.parent_comment);
            if (parentComment) {
              parentComment.replies = parentComment.replies || [];
              parentComment.replies.push(comment);
            } else {
              blog.comments.push(comment);
            }
          } else {
            blog.comments.push(comment);
          }
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { blogId, commentId } = action.payload;
        const blog = state.blogs.find(b => b.id === blogId);
        if (blog) {
          const filterNestedComments = (comments) => {
            return comments.filter(comment => {
              if (comment.id === commentId) return false;
              if (comment.replies) {
                comment.replies = filterNestedComments(comment.replies);
              }
              return true;
            });
          };
          blog.comments = filterNestedComments(blog.comments);
        }
      })
      
  }
});

export const { resetBlogState } = blogSlice.actions;
export default blogSlice.reducer;
