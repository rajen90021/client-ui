import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { getSession } from '@/lib/session';
import { Coins, CreditCard, Plus } from 'lucide-react';
import { redirect } from 'next/navigation';
import CustomerForm from './components/customerForm';

export default async function Checkout({
    searchParams,
}: {
    searchParams: { restaurantId: string };
}) {
    const session = await getSession();
 
    const sParams = new URLSearchParams();

    // Safely copy searchParams into URLSearchParams, ignoring any non-string values
    Object.entries(searchParams ?? {}).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((v) => {
                if (v != null) {
                    sParams.append(key, String(v));
                }
            });
        } else if (value != null) {
            sParams.append(key, String(value));
        }
    });

    const existingQueryString = sParams.toString();

    sParams.append('return-to', `/checkout?${existingQueryString}`);

    // /login?return-to=/checkout?existingQueryString

    if (!session) {
        redirect(`/login?${sParams.toString()}`);
    }

    return <CustomerForm />;
}
