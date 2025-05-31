"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Loader2, User, Calendar } from "lucide-react";
import { useSession, useUser } from "@clerk/nextjs";
import { useCreateCommentMutation, useGetCommentsByIssueIdQuery } from "@/store/api/issuesApi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  issueId: number;
  issueTitle: string;
  onCommentAdded?: () => void;
}

export default function CommentModal({
  isOpen,
  onClose,
  issueId,
  issueTitle,
  onCommentAdded
}: CommentModalProps) {
  const [comment, setComment] = useState("");
  const { user } = useUser();
  const [createComment, { isLoading: isSubmitting }] = useCreateCommentMutation();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Fetch existing comments for this issue
  const {
    data: comments = [],
    isLoading: isLoadingComments,
    refetch: refetchComments
  } = useGetCommentsByIssueIdQuery(issueId, {
    skip: !isOpen || !issueId // Only fetch when modal is open and we have an issueId
  });

  // Scroll to bottom when comments change
  useEffect(() => {
    if (scrollAreaRef.current && comments.length > 0) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [comments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim() || !user) return;

    try {
      // Create the comment using Redux mutation
      await createComment({
        content: comment.trim(),
        author: user.emailAddresses[0]?.emailAddress || user.firstName || 'Anonymous',
        issue_id: issueId
      }).unwrap();

      // Reset form but keep modal open to show the new comment
      setComment("");

      // Refetch comments to show the new one
      refetchComments();

      // Notify parent component that a comment was added
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Error creating comment:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Comment data being sent:', {
        content: comment.trim(),
        author: user?.emailAddresses[0]?.emailAddress || user?.firstName || 'Anonymous',
        issue_id: issueId
      });
      // You could add a toast notification here for better UX
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setComment("");
      onClose();
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            Comments
          </DialogTitle>
          <DialogDescription>
            Discussion for: <span className="font-medium">{issueTitle}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Existing Comments Section */}
        <div className="flex-1 min-h-0">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">
                Comments ({comments.length})
              </h4>
              {isLoadingComments && (
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              )}
            </div>

            <ScrollArea ref={scrollAreaRef} className="h-64 w-full border rounded-md p-3">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment, index) => (
                    <div key={comment.id} className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {comment.author}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                      {index < comments.length - 1 && (
                        <Separator className="my-3" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        {/* Add Comment Form */}
        <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium text-gray-700">
              Your Comment
            </label>
            <Textarea
              id="comment"
              placeholder="Share your thoughts, suggestions, or additional information about this issue..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={isSubmitting}
              required
            />
            <div className="text-xs text-gray-500">
              {comment.length}/500 characters
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!comment.trim() || isSubmitting || comment.length > 500}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Post Comment
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
