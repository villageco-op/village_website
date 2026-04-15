import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn, within, expect, waitFor, fireEvent } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse, delay } from 'msw';

import { ListingImageUpload } from './ListingImageUpload';

import { Toaster } from '@/components/ui/sonner';

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const meta: Meta<typeof ListingImageUpload> = {
  title: 'Seller/NewListing/ListingImageUpload',
  component: ListingImageUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={mockedQueryClient}>
        <div className="w-150 p-4">
          <Story />
          <Toaster />
        </div>
      </QueryClientProvider>
    ),
  ],
  args: {
    images: [],
    onAddImage: fn(),
    onRemoveImage: fn(),
    isUploading: false,
    setIsUploading: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ListingImageUpload>;

/**
 * Initial state with no images uploaded.
 */
export const Empty: Story = {};

/**
 * State showing multiple uploaded images in the grid.
 */
export const WithImages: Story = {
  args: {
    images: [
      'https://images.unsplash.com/photo-1597362860722-39450a958042?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=300&h=300',
    ],
  },
};

/**
 * Demonstrates the UI when the limit of 4 images is reached (upload button hidden).
 */
export const MaxImagesReached: Story = {
  args: {
    images: [
      'https://images.unsplash.com/photo-1597362860722-39450a958042?w=300',
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300',
      'https://images.unsplash.com/photo-1566385101042-1a0aa0c12e8c?w=300',
      'https://images.unsplash.com/photo-1518977676601-b53f02bad675?w=300',
    ],
  },
};

/**
 * Visualizes the loading spinner state during an active upload.
 */
export const UploadingState: Story = {
  args: {
    isUploading: true,
  },
};

/**
 * Simulates a successful image upload using MSW to catch the API call.
 */
export const SuccessfulUpload: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/upload', async () => {
          await delay(1000);
          return HttpResponse.json({
            status: 200,
            data: { url: 'https://images.unsplash.com/photo-1597362860722-39450a958042?w=300' },
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement, args }) => {
    const file = new File(['dummy content'], 'tomato.png', { type: 'image/png' });
    const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;

    await fireEvent.change(input, { target: { files: [file] } });

    await waitFor(async () => {
      await expect(args.setIsUploading).toHaveBeenCalledWith(true);
    });
  },
};

/**
 * Simulates a server error during upload to verify toast notifications.
 */
export const UploadError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post('*/api/upload', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const file = new File(['dummy content'], 'bad-image.png', { type: 'image/png' });
    const input = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;

    await fireEvent.change(input, { target: { files: [file] } });

    // Check for error toast text in the body (outside the canvas)
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText(/Could not upload image/i)).toBeInTheDocument();
  },
};
