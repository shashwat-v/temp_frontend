// Mock API handlers for testing
import { rest } from 'msw';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/v1';

export const handlers = [
    // Auth endpoints
    rest.post(`${API_URL}/users/register`, (req, res, ctx) => {
        return res(
            ctx.status(201),
            ctx.json({
                success: true,
                data: {
                    token: 'mock-jwt-token',
                    user: {
                        id: 1,
                        email: req.body.email,
                        full_name: req.body.fullName,
                        role: 'user'
                    }
                }
            })
        );
    }),

    rest.post(`${API_URL}/users/login`, (req, res, ctx) => {
        const { email, password } = req.body;

        if (email === 'test@example.com' && password === 'Password123!') {
            return res(
                ctx.status(200),
                ctx.json({
                    success: true,
                    data: {
                        token: 'mock-jwt-token',
                        user: {
                            id: 1,
                            email: 'test@example.com',
                            full_name: 'Test User',
                            role: 'user'
                        }
                    }
                })
            );
        }

        return res(
            ctx.status(401),
            ctx.json({
                success: false,
                error: 'Invalid credentials'
            })
        );
    }),

    rest.get(`${API_URL}/users/profile`, (req, res, ctx) => {
        const authHeader = req.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res(
                ctx.status(401),
                ctx.json({
                    success: false,
                    error: 'Unauthorized'
                })
            );
        }

        return res(
            ctx.status(200),
            ctx.json({
                success: true,
                data: {
                    user: {
                        id: 1,
                        email: 'test@example.com',
                        full_name: 'Test User',
                        role: 'user'
                    }
                }
            })
        );
    }),

    // Issues endpoints
    rest.get(`${API_URL}/issues`, (req, res, ctx) => {
        const category = req.url.searchParams.get('category');
        const status = req.url.searchParams.get('status');

        let issues = [
            {
                id: 1,
                title: 'Pothole on Main St',
                description: 'Large pothole',
                category: 'infrastructure',
                status: 'pending',
                latitude: 40.7128,
                longitude: -74.0060,
                upvotes: 5
            },
            {
                id: 2,
                title: 'Broken Streetlight',
                description: 'Light not working',
                category: 'safety',
                status: 'in_progress',
                latitude: 40.7130,
                longitude: -74.0065,
                upvotes: 3
            }
        ];

        if (category) {
            issues = issues.filter(i => i.category === category);
        }
        if (status) {
            issues = issues.filter(i => i.status === status);
        }

        return res(
            ctx.status(200),
            ctx.json({
                success: true,
                data: { issues }
            })
        );
    }),

    rest.get(`${API_URL}/issues/:id`, (req, res, ctx) => {
        const { id } = req.params;

        if (id === '999') {
            return res(
                ctx.status(404),
                ctx.json({
                    success: false,
                    error: 'Issue not found'
                })
            );
        }

        return res(
            ctx.status(200),
            ctx.json({
                success: true,
                data: {
                    issue: {
                        id: parseInt(id),
                        title: 'Test Issue',
                        description: 'Test description',
                        category: 'infrastructure',
                        status: 'pending',
                        latitude: 40.7128,
                        longitude: -74.0060,
                        upvotes: 5,
                        comments: []
                    }
                }
            })
        );
    }),

    rest.post(`${API_URL}/issues`, (req, res, ctx) => {
        const authHeader = req.headers.get('Authorization');

        if (!authHeader) {
            return res(
                ctx.status(401),
                ctx.json({
                    success: false,
                    error: 'Authentication required'
                })
            );
        }

        return res(
            ctx.status(201),
            ctx.json({
                success: true,
                data: {
                    issue: {
                        id: 3,
                        ...req.body,
                        status: 'pending',
                        upvotes: 0
                    }
                }
            })
        );
    }),

    rest.post(`${API_URL}/issues/:id/upvote`, (req, res, ctx) => {
        const authHeader = req.headers.get('Authorization');

        if (!authHeader) {
            return res(
                ctx.status(401),
                ctx.json({
                    success: false,
                    error: 'Authentication required'
                })
            );
        }

        return res(
            ctx.status(200),
            ctx.json({
                success: true,
                message: 'Issue upvoted successfully',
                data: { upvotes: 6 }
            })
        );
    }),

    // Forum endpoints
    rest.get(`${API_URL}/forum/categories`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                success: true,
                data: {
                    categories: [
                        { id: 1, name: 'General', description: 'General discussions', icon: '💬' },
                        { id: 2, name: 'Support', description: 'Get help', icon: '❓' }
                    ]
                }
            })
        );
    }),

    // Analytics endpoints
    rest.get(`${API_URL}/analytics/overview`, (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                success: true,
                data: {
                    totalIssues: 150,
                    pendingIssues: 45,
                    resolvedIssues: 85,
                    totalUsers: 320
                }
            })
        );
    }),

    // Error simulation endpoint
    rest.get(`${API_URL}/error`, (req, res, ctx) => {
        return res(
            ctx.status(500),
            ctx.json({
                success: false,
                error: 'Internal server error'
            })
        );
    })
];
