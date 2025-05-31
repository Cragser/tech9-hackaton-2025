"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Calendar, CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";

// Schema for form validation
const heroCompletionSchema = z.object({
  solution: z.string().min(10, "Please provide a detailed solution description"),
  estimatedTime: z.string().min(1, "Please provide an estimated completion time"),
  materials: z.string().optional(),
  proofImage: z.string().optional(),
  completionNotes: z.string().optional(),
});

type HeroCompletionForm = z.infer<typeof heroCompletionSchema>;

interface HeroCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: {
    id: number;
    title: string;
    description: string;
    category?: string;
    priority: string;
    location: string;
    photo_url?: string;
  };
  onSubmit: (data: HeroCompletionForm) => Promise<void>;
}

export function HeroCompletionModal({
  isOpen,
  onClose,
  issue,
  onSubmit
}: HeroCompletionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<HeroCompletionForm>({
    resolver: zodResolver(heroCompletionSchema),
    defaultValues: {
      solution: "",
      estimatedTime: "",
      materials: "",
      proofImage: "",
      completionNotes: "",
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setPreviewImage(imageUrl);
        form.setValue("proofImage", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (data: HeroCompletionForm) => {
    setIsSubmitting(true);
    try {
      // Simulate API call delay (400ms as per workspace rules)
      await new Promise(resolve => setTimeout(resolve, 400));

      await onSubmit(data);

      // Reset form and close modal
      form.reset();
      setPreviewImage(null);
      onClose();
    } catch (error) {
      console.error("Failed to submit hero completion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Become a Hero for this Issue
          </DialogTitle>
          <DialogDescription>
            You're about to claim this issue and help your community. Please provide details about how you plan to resolve it.
          </DialogDescription>
        </DialogHeader>

        {/* Issue Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-4">
            {issue.photo_url && (
              <div className="flex-shrink-0 relative w-20 h-20">
                <Image
                  src={issue.photo_url}
                  alt="Issue thumbnail"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">{issue.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{issue.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={getPriorityColor(issue.priority)}>
                  {issue.priority} Priority
                </Badge>
                <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                  {issue.category || 'Uncategorized'}
                </Badge>
              </div>
              <p className="text-gray-500 text-sm mt-2">📍 {issue.location}</p>
            </div>
          </div>
        </div>

        {/* Hero Completion Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Solution Description */}
            <FormField
              control={form.control}
              name="solution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How will you solve this issue? *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your plan to fix this issue, including steps you'll take..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estimated Time */}
            <FormField
              control={form.control}
              name="estimatedTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated completion time *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select estimated time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1-2 hours">1-2 hours</SelectItem>
                      <SelectItem value="3-6 hours">3-6 hours</SelectItem>
                      <SelectItem value="1 day">1 day</SelectItem>
                      <SelectItem value="2-3 days">2-3 days</SelectItem>
                      <SelectItem value="1 week">1 week</SelectItem>
                      <SelectItem value="2+ weeks">2+ weeks</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Materials Needed */}
            <FormField
              control={form.control}
              name="materials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Materials/tools needed (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List any materials, tools, or resources you'll need..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Proof Image Upload */}
            <div className="space-y-2">
              <Label>Upload proof image (optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {previewImage ? (
                  <div className="relative">
                    <div className="relative w-full h-48">
                      <Image
                        src={previewImage}
                        alt="Proof preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setPreviewImage(null);
                        form.setValue("proofImage", "");
                      }}
                    >
                      Remove image
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Upload a photo showing your solution or progress</p>
                    <label htmlFor="proof-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Image
                        </span>
                      </Button>
                    </label>
                    <input
                      id="proof-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Completion Notes */}
            <FormField
              control={form.control}
              name="completionNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional information or notes about your solution..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Claiming Issue...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Claim & Solve Issue
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
