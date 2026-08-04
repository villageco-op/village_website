import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';

interface ContactSuccessProps {
  title: string;
  description: string;
  buttonText: string;
  onReset: () => void;
}

/**
 * The contact success state. Display when a contact form is successfuly submitted.
 * @param props - Component props
 * @param props.title - The title
 * @param props.description - The description
 * @param props.buttonText - The send again button text
 * @param props.onReset - When the send again button is pressed
 * @returns A title, description, and button
 */
export function ContactSuccess({ title, description, buttonText, onReset }: ContactSuccessProps) {
  return (
    <CardContent className="flex flex-col items-center justify-center p-12 sm:p-16 text-center">
      <h2 className="font-heading text-2xl font-bold text-deep-forest mb-2">{title}</h2>
      <p className="text-deep-forest/80 mb-8 max-w-md">{description}</p>
      <Button variant="lime" onClick={onReset}>
        {buttonText}
      </Button>
    </CardContent>
  );
}
