# My Beautiful Todo

A beautiful, feature-rich todo application built with Next.js, featuring weekly task tracking, progress visualization, and a delightful frog-themed interface.

## Features

- **Task Management**: Create, edit, and delete tasks with size and urgency levels
- **Weekly Tasks**: Track recurring tasks that need to be completed multiple times per week
- **Progress Tracking**: Visual progress bars and completion indicators for weekly goals
- **Completion Instances**: Each weekly task completion creates a separate task item for detailed tracking
- **Auto-Hide Completed Tasks**: Completed tasks automatically hide after 24 hours to keep your list clean
- **Completed Tasks Archive**: "See All Completed Tasks" button to view your full completion history
- **Tag System**: Organize tasks with custom tags
- **Comments**: Add comments to tasks for additional context
- **Dark Mode**: Beautiful dark and light theme support
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Weekly Task Functionality

The app now supports weekly tasks that need to be completed multiple times per week:

- **Weekly Task Creation**: When creating a task, check "Weekly Task" and specify how many times per week it should be completed
- **Progress Tracking**: See your progress with visual indicators (✓✓_ _ _) and progress bars
- **Completion Records**: Each time you mark a weekly task as done, it creates a completion record
- **Weekly Reset**: Progress automatically resets every Monday
- **Statistics**: View detailed weekly statistics and completion history
- **Visual Feedback**: Progress bars and completion dots show your current status

### How Weekly Tasks Work

1. **Create a Weekly Task**: Check the "Weekly Task" checkbox and set the number of times per week
2. **Track Progress**: Each completion adds to your weekly count
3. **Visual Indicators**: See progress with dots and progress bars
4. **Weekly Stats**: Click "Weekly Stats" to view detailed completion history
5. **Automatic Reset**: Progress resets every Monday for a fresh start
6. **Completion Instances**: Each completion creates a separate task item in your completed tasks list

### Auto-Hide Completed Tasks

- **Automatic Cleanup**: Completed tasks automatically disappear from your main view after 24 hours
- **Keep Focus**: This helps you stay focused on current tasks without clutter
- **Full History**: Click "See All Completed Tasks" to view your complete archive
- **Completion Tracking**: Each task tracks exactly when it was completed for accurate filtering

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
