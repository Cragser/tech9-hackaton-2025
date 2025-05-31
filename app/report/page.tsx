"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, AlertCircle, Upload } from "lucide-react";

export default function ReportPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    urgency: "medium"
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    "Infrastructure",
    "Safety",
    "Environment",
    "Public Facilities",
    "Transportation",
    "Other"
  ];

  const urgencyLevels = [
    { value: "low", label: "Low", color: "text-green-600" },
    { value: "medium", label: "Medium", color: "text-yellow-600" },
    { value: "high", label: "High", color: "text-red-600" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) return;
    
    setSubmitting(true);
    // TODO: Implement issue submission to database
    setTimeout(() => {
      alert("Issue reported successfully! Our community heroes will be notified.");
      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        urgency: "medium"
      });
      setSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Report an Issue
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Help improve your community by reporting problems that need attention. 
          Our heroes are ready to help!
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Report Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Issue Details</CardTitle>
              <CardDescription>
                Provide as much detail as possible to help heroes understand and fix the problem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Title *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Brief description of the issue"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Detailed description of the issue, including size, severity, and any safety concerns"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      id="location"
                      name="location"
                      type="text"
                      placeholder="Street address or nearby landmark"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level
                  </label>
                  <div className="flex space-x-4">
                    {urgencyLevels.map((level) => (
                      <label key={level.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="urgency"
                          value={level.value}
                          checked={formData.urgency === level.value}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <span className={`font-medium ${level.color}`}>
                          {level.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo (Coming Soon)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 opacity-60">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Photo upload feature coming soon</p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={submitting || !formData.title || !formData.description || !formData.category}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3"
                >
                  {submitting ? 'Submitting...' : 'Report Issue'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Guidelines */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Reporting Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900 text-sm">Be Specific</p>
                  <p className="text-xs text-gray-600">Include exact location and clear description</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Safety First</p>
                  <p className="text-xs text-gray-600">Mark urgent issues that pose immediate danger</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Community Focus</p>
                  <p className="text-xs text-gray-600">Report issues affecting public spaces</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">No Duplicates</p>
                  <p className="text-xs text-gray-600">Check if the issue has already been reported</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-700">1</span>
                </div>
                <p className="text-sm text-gray-600">Your report is reviewed by our AI for guidelines compliance</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-700">2</span>
                </div>
                <p className="text-sm text-gray-600">Community heroes are notified and can claim the issue</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-700">3</span>
                </div>
                <p className="text-sm text-gray-600">You&apos;ll receive updates when progress is made</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 