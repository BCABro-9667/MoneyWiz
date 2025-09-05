
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getUserIdFromToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
    await dbConnect();
    try {
        const userId = getUserIdFromToken(request);
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { name, avatar } = await request.json();

        if (!name && !avatar) {
            return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
        }

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (name) user.name = name;
        if (avatar) user.avatar = avatar;

        await user.save();

        // Re-issue token if name or email changed
        const token = jwt.sign(
          { userId: user._id, name: user.name, email: user.email },
          process.env.JWT_SECRET!,
          { expiresIn: '1d' }
        );

        cookies().set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        const { passwordHash, ...userWithoutPassword } = user.toObject();

        return NextResponse.json(userWithoutPassword, { status: 200 });

    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
