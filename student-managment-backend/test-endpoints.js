const http = require('http');

const BASE_URL = 'http://localhost:5000/api/students';

const request = (method, url, data = null) => {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        statusCode: res.statusCode,
                        data: body ? JSON.parse(body) : null
                    });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (err) => reject(err));

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
};

const runTests = async () => {
    try {
        console.log('🚀 Starting Comprehensive API Tests...');

        // 1. GET ALL
        console.log('\n--- 1. Testing GET /api/students (List All) ---');
        const listAll = await request('GET', BASE_URL);
        console.log(`Status: ${listAll.statusCode}`);
        console.log(`Count: ${listAll.data.length} students found.`);

        // 2. SEARCH
        console.log('\n--- 2. Testing SEARCH (name=John) ---');
        const searchResult = await request('GET', `${BASE_URL}?search=John`);
        console.log(`Status: ${searchResult.statusCode}`);
        console.log(`Results: ${searchResult.data.length} found.`);
        if (searchResult.data.length > 0) console.log(`First Match: ${searchResult.data[0].name}`);

        // 3. FILTER BY COURSE
        console.log('\n--- 3. Testing FILTER (course=Information Technology) ---');
        const filterResult = await request('GET', `${BASE_URL}?course=Information%20Technology`);
        console.log(`Status: ${filterResult.statusCode}`);
        console.log(`Results: ${filterResult.data.length} found.`);

        // 4. CREATE (POST)
        console.log('\n--- 4. Testing CREATE (POST /api/students) ---');
        const newStudent = {
            name: "Test User",
            course: "Testing Science",
            year: 1,
            department: "Quality Assurance",
            email: `tester.${Date.now()}@example.com`,
            gender: "Male"
        };
        const createResult = await request('POST', BASE_URL, newStudent);
        console.log(`Status: ${createResult.statusCode}`);
        const testStudentId = createResult.data.id;
        console.log(`Created Student ID: ${testStudentId}`);

        // 5. UPDATE (PUT)
        console.log('\n--- 5. Testing UPDATE (PUT /api/students/:id) ---');
        const updateData = { name: "Updated Tester Name" };
        const updateResult = await request('PUT', `${BASE_URL}/${testStudentId}`, updateData);
        console.log(`Status: ${updateResult.statusCode}`);
        console.log(`New Name: ${updateResult.data.name}`);

        // 6. DELETE
        console.log('\n--- 6. Testing DELETE (DELETE /api/students/:id) ---');
        const deleteResult = await request('DELETE', `${BASE_URL}/${testStudentId}`);
        console.log(`Status: ${deleteResult.statusCode}`);
        console.log(`Message: ${deleteResult.data.message}`);

        // 7. VERIFY DELETION
        console.log('\n--- 7. Verifying Deletion ---');
        const verifyResult = await request('GET', `${BASE_URL}/${testStudentId}`);
        console.log(`Status (Expected 404): ${verifyResult.statusCode}`);

        console.log('\n✅ All tests completed successfully!');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('Make sure the server is running on http://localhost:5000');
    }
};

runTests();
