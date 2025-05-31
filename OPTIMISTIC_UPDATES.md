# Optimistic Updates for Like Button

## Problem Solved
Previously, when a user clicked the like button, the entire issues list would refetch and potentially re-sort, causing a jarring user experience where the issue they just liked might move to a different position in the list.

## Solution: Optimistic Updates
Implemented optimistic updates using RTK Query's `onQueryStarted` feature to immediately update the UI without refetching data.

## How It Works

### 1. Immediate UI Update
When the user clicks the like button:
```typescript
// Immediately increment the likes count in the cache
const patchResult = dispatch(
  issuesApi.util.updateQueryData('getIssues', undefined, (draft) => {
    const issue = draft.find((issue) => issue.id === id);
    if (issue) {
      issue.likes = (issue.likes || 0) + 1;
    }
  })
);
```

### 2. Background Database Update
The actual database update happens in the background:
```typescript
try {
  // Wait for the mutation to complete
  await queryFulfilled;
} catch {
  // If the mutation fails, revert the optimistic update
  patchResult.undo();
}
```

### 3. Error Handling
If the database update fails, the optimistic update is automatically reverted, returning the UI to its previous state.

## Benefits

### ✅ **Instant Feedback**
- Like count updates immediately when clicked
- No waiting for network requests
- Smooth, responsive user experience

### ✅ **No List Re-sorting**
- Issues stay in their current position
- No jarring movements or jumps
- Maintains user's visual context

### ✅ **Automatic Error Recovery**
- If the database update fails, the UI reverts automatically
- No inconsistent state between UI and database
- Graceful error handling

### ✅ **Network Efficiency**
- No unnecessary refetching of all issues
- Only updates the specific issue that was liked
- Reduces bandwidth and server load

## Implementation Details

### Cache Updates
```typescript
// Updates the Redux cache directly without API calls
issuesApi.util.updateQueryData('getIssues', undefined, (draft) => {
  // Modify the cached data
});
```

### No Cache Invalidation
```typescript
// Prevents automatic refetching
invalidatesTags: [],
```

### Optimistic Pattern
1. **Update UI immediately** (optimistic)
2. **Send request to server** (background)
3. **Keep changes if successful** OR **revert if failed**

## User Experience

### Before (with refetching):
1. User clicks like button
2. Button shows loading state
3. Entire list refetches from server
4. List potentially re-sorts
5. User loses their place in the list

### After (with optimistic updates):
1. User clicks like button
2. Like count increments immediately
3. Database updates in background
4. List stays exactly where it was
5. User maintains their context

## Error Scenarios

### Network Failure
- UI updates immediately
- Background request fails
- UI automatically reverts to previous state
- User sees the like count return to original value

### Database Error
- UI updates immediately
- Database rejects the update
- UI automatically reverts
- Error is logged to console for debugging

## Testing
To test the optimistic updates:
1. Click a like button
2. Notice the count increments immediately
3. Check that the issue stays in the same position
4. Verify the database was actually updated
5. Test with network disabled to see error recovery

## Future Enhancements
- Add toast notifications for success/error feedback
- Implement optimistic updates for other actions (claim, resolve)
- Add visual indicators for pending operations
- Implement retry logic for failed updates
