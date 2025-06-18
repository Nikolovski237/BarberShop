import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 5 },
        { duration: '30s', target: 10 },
        { duration: '10s', target: 0 },
    ],
};

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjdjNGIxNGNhLTcxMTgtNGYxOS1iZDQ5LTM2ZWQ3MDAzZGM2MyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImN1c3RvbWVyMkBiYXJiZXIuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IkN1c3RvbWVyIDIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJDdXN0b21lciIsImV4cCI6MTc0Nzg0MDg2NywiaXNzIjoiQmFyYmVyQVBJIiwiYXVkIjoiQmFyYmVyQ2xpZW50In0.wI3qqNcOJbGpPPP__iPjeYeP108Ly4eLYkew9GEka6k';
const barberId = '7c4b14ca-7118-4f19-bd49-36ed7003dc63';

export default function () {
    const url = 'http://localhost:5038/api/appointments';
    const payload = JSON.stringify({
        customerName: 'Load Tester',
        customerPhone: '000000000',
        appointmentDateTime: new Date(Date.now() + 3600000).toISOString(),
        barberId: barberId,
    });

    const headers = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    
    const res = http.post(url, payload, headers);

    console.log(`Status: ${res.status} | Body: ${res.body}`);

    check(res, {
        'Appointment created': (r) => r.status === 200 || r.status === 201,
    });


    sleep(1);
}
