'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface QuoteFormProps {
  productName: string;
}

export function QuoteForm({ productName }: QuoteFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-xl font-semibold text-emerald-700 mb-2">
          Quote Request Received!
        </h3>
        <p className="text-muted-foreground text-sm">
          Our insurance advisor will contact you within 24 hours with personalized{' '}
          {productName.toLowerCase()} quotes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Rahul Sharma"
            required
            className="bg-white"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            required
            className="bg-white"
          />
        </div>
      </div>
      <div>
        <label htmlFor="productType" className="block text-sm font-medium mb-1.5">
          Insurance Type
        </label>
        <Input
          id="productType"
          name="productType"
          defaultValue={productName}
          readOnly
          className="bg-gray-50 text-muted-foreground"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1.5">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your insurance needs..."
          rows={3}
          className="bg-white"
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11"
      >
        {loading ? 'Submitting...' : 'Get Free Quote →'}
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        By submitting, you agree to our privacy policy. No spam, ever.
      </p>
    </form>
  );
}
