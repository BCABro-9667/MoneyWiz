
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from '@/components/ui/skeleton';
import { User as UserIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required.' }),
  newPassword: z.string().min(6, { message: 'New password must be at least 6 characters.' }),
});

interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt: string;
}

export default function ProfileClient() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    async function fetchUser() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/user');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        setUser(userData);
        setAvatarUrl(userData.avatar || '');
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [toast]);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    values: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/auth/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: values.name, avatar: avatarUrl }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      setUser(data);
      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message,
      });
    } finally {
      setIsUpdating(false);
    }
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
     toast({
        variant: 'default',
        title: 'Coming Soon',
        description: 'Password change functionality will be implemented soon!',
      });
  }
  
  if (isLoading) {
    return (
        <div className="space-y-6">
            <Card className="rounded-2xl">
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent className="flex items-center gap-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-10 w-48" />
                </CardContent>
            </Card>
             <Card className="rounded-2xl">
                <CardHeader>
                     <Skeleton className="h-7 w-40" />
                     <Skeleton className="h-4 w-56 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <div className="flex justify-end">
                      <Skeleton className="h-10 w-24" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Could not load user profile. Please try logging in again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="rounded-2xl shadow-lg">
         <CardHeader>
            <CardTitle>Avatar</CardTitle>
            <CardDescription>Update your profile picture using an image URL.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar || '/avatar.png'} alt={user.name} />
            <AvatarFallback><UserIcon className="h-12 w-12" /></AvatarFallback>
          </Avatar>
           <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Update Avatar</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Update Avatar URL</AlertDialogTitle>
                  <AlertDialogDescription>
                    Please enter the URL of your new avatar image.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                    type="url"
                    placeholder="https://example.com/avatar.png"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onProfileSubmit({ name: user.name, email: user.email })}>Save</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your name. Email is not editable.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled>Update Password</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
