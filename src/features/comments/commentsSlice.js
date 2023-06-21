// Import createAsyncThunk and createSlice here.
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Create loadCommentsForArticleId here.
export const loadCommentsForArticleId = createAsyncThunk(
  'comments/loadCommentsForArticleId',
  async (commentId, thunkAPI) => {
    const response = await fetch(`api/articles/${commentId}/comments`);
    const json = await response.json();
    return json;
  }
);

// Create postCommentForArticleId here.
export const postCommentForArticleId = createAsyncThunk(
  'comments/postCommentForArticleId',
  async ({articleId, comment}, thunkAPI) => {
    const requestBody = JSON.stringify({comment});
    const response = await fetch(
      `api/articles/${articleId}/comments`, 
      { method: 'post', body: requestBody }
    );
    const json = await response.json();
    return json;
  }
);

export const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    // Add initial state properties here.
    byArticleId: {},

    isLoadingComments: false,
    failedToLoadComments: false,

    createCommentIsPending: false,
    failedToCreateComment: false,
  },
  // Add extraReducers here.
  extraReducers: (builder) => {
    builder
      .addCase( loadCommentsForArticleId.pending, (state, action) => {
        state.isLoadingComments = true;
        state.failedToLoadComments = false;
      })
      .addCase(loadCommentsForArticleId.fulfilled, (state, action) => {
        state.byArticleId.map(article => article.id === action.payload.articleId);
        state.isLoadingComments = false;
        state.failedToLoadComments = false;
      })
      .addCase(loadCommentsForArticleId.rejected, (state, action) => {
        state.isLoadingComments = false;
        state.failedToLoadComments = true;
      })

      .addCase(postCommentForArticleId.pending, (state, action) => {
        state.createCommentIsPending = true;
        state.failedToCreateComment = false;
      })
      .addCase(postCommentForArticleId.fulfilled, (state, action) => {
        const foundArticle = state.byArticleId.find(article => article.id === action.payload.articleId);
        if(foundArticle) {
          foundArticle.id.push(action.payload.comment);
        }
        state.createCommentIsPending = false;
        state.failedToCreateComment = false;
      })
      .addCase(postCommentForArticleId.rejected, (state, action) => {
        state.createCommentIsPending = false;
        state.failedToCreateComment = true;
      })
  }
});

export const selectComments = (state) => state.comments.byArticleId;
export const isLoadingComments = (state) => state.comments.isLoadingComments;
export const createCommentIsPending = (state) => state.comments.createCommentIsPending;

export default commentsSlice.reducer;
