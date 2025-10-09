"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar } from "lucide-react";

interface ChatUserProfileProps {
  userId: string;
  isLandlord: boolean;
  userName?: string; // Pass the resolved user name from parent
  className?: string;
}

interface UserProfile {
  id: string;
  displayName: string;
  primaryEmail: string;
  profileImageUrl?: string;
  createdAt?: string;
}

export default function ChatUserProfile({ userId, isLandlord, userName, className = "" }: ChatUserProfileProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}`);
        if (response.ok) {
          const userData = await response.json();
          setUserProfile({
            id: userData.id,
            displayName: userName || userData.displayName || userData.primaryEmail?.split('@')[0] || `User ${userId.slice(-4)}`,
            primaryEmail: userData.primaryEmail || "",
            profileImageUrl: userData.profileImageUrl,
            createdAt: userData.createdAt
          });
        } else {
          // Fallback for when user data is not available
          setUserProfile({
            id: userId,
            displayName: userName || `User ${userId.slice(-4)}`,
            primaryEmail: "",
          });
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        // Fallback for errors
        setUserProfile({
          id: userId,
          displayName: userName || `User ${userId.slice(-4)}`,
          primaryEmail: "",
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadUserProfile();
    }
  }, [userId, isLandlord]);

  if (loading) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Avatar className="w-10 h-10">
          <AvatarFallback>
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">Unknown User</span>
            <Badge variant="secondary" className="text-xs">
              {isLandlord ? "Landlord" : "Tenant"}
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar className="w-10 h-10">
        <AvatarImage 
          src={userProfile.profileImageUrl || `/api/users/${userId}/avatar`} 
          alt={userProfile.displayName} 
        />
        <AvatarFallback className="bg-blue-100 text-blue-600">
          {userProfile.displayName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm truncate">
            {userProfile.displayName}
          </span>
          <Badge variant={isLandlord ? "default" : "secondary"} className="text-xs">
            {isLandlord ? "Landlord" : "Tenant"}
          </Badge>
        </div>
        
        {userProfile.primaryEmail && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Mail className="w-3 h-3" />
            <span className="truncate">{userProfile.primaryEmail}</span>
          </div>
        )}
      </div>
    </div>
  );
}