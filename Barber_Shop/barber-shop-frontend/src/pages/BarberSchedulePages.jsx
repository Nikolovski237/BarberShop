import { Card, CardContent } from "@/components/ui/card";

export default function BarberSchedulePage() {
    return (
        <Card className="max-w-2xl mx-auto mt-10 shadow-md p-6 rounded-xl">
            <CardContent>
                <h2 className="text-2xl font-bold mb-4">Barber Schedule</h2>
                <p className="text-gray-600">
                    This page will show the logged-in barber's upcoming appointments.
                    You can extend it to list today's appointments, future bookings,
                    and status update options.
                </p>
            </CardContent>
        </Card>
    );
}
