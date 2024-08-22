// import { expect } from 'chai';
// import supertest from 'supertest';
// import app from '../server.js'; // Adjust the path as needed
// import mongoose from 'mongoose';
// import Class from '../model/classSchema.js'; // Adjust the import as needed

// const request = supertest(app);

// // Connect to a test database before running tests
// before(async () => {
//   await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
// });

// // Clean up the test database after tests are finished
// after(async () => {
//   await mongoose.connection.dropDatabase();
//   await mongoose.connection.close();
// });

// describe('Class API', () => {
//   let classId;

//   // CREATE A CLASS
//   it('should create a new class', async () => {
//     const response = await request.post('/api/classes')
//       .send({
//         title: 'Math 101',
//         date: '2024-08-30',
//         starttime: '10:00',
//         endtime: '11:00',
//         repeat: false
//       })
//       .expect(200);

//     expect(response.body).to.have.property('_id');
//     classId = response.body._id; // Save ID for later tests
//     expect(response.body).to.include({
//       title: 'Math 101',
//       date: '2024-08-30T00:00:00.000Z',
//       starttime: '10:00',
//       endtime: '11:00',
//       repeat: false
//     });
//   });

//   // GET CLASSES FOR THE USER
//   it('should get classes for the user', async () => {
//     const response = await request.get('/api/classes')
//       .expect(200);

//     expect(response.body).to.be.an('array');
//     expect(response.body[0]).to.include({
//       title: 'Math 101',
//       date: '2024-08-30T00:00:00.000Z',
//       starttime: '10:00',
//       endtime: '11:00',
//       repeat: false
//     });
//   });

//   // UPDATE A CLASS
//   it('should update a class', async () => {
//     const response = await request.patch(`/api/classes/${classId}`)
//       .send({
//         title: 'Advanced Math 101'
//       })
//       .expect(200);

//     expect(response.body).to.include({
//       title: 'Advanced Math 101'
//     });
//   });

//   // DELETE A CLASS
//   it('should delete a class', async () => {
//     await request.delete(`/api/classes/${classId}`)
//       .expect(200);

//     const response = await request.get('/api/classes')
//       .expect(200);

//     expect(response.body).to.be.an('array').that.is.empty;
//   });

//   // GET CLASSES FOR THE WEEK
//   it('should get classes for a date range', async () => {
//     const response = await request.get('/api/classes')
//       .query({ startDate: '2024-08-01', endDate: '2024-08-31' })
//       .expect(200);

//     expect(response.body).to.be.an('array');
//     expect(response.body[0]).to.include({
//       title: 'Advanced Math 101'
//     });
//   });
// });

import dotenv from "dotenv";
dotenv.config();
import request from "supertest";
import { expect } from "chai";

import app from '../server.js';

before(function (done) {
    this.timeout(3000);
    setTimeout(done, 2000);
});

describe('Class API', () => {
    let classId;
    const testUserId = '669ab851b9b8b804ded1f37f'

    // CREATE A CLASS
    it('should create a new class', async () => {
        try {
            console.log("POSTING A CLASS NOW IN TEST")
            const response = await request(app)
                .post('/api/classes')
                .send({
                    title: 'Machine Learning',
                    date: '2024-07-22', // ISO format
                    starttime: '12:00', // 24-hour format
                    endtime: '13:00', // 24-hour format
                    repeat: false,
                    user: testUserId
                })
                .expect(200);
            console.log("Class posted")

            if (!response || !response.body) {
                throw new Error('Response or response body is undefined');
            }

            expect(response.body).to.have.property('_id');
            classId = response.body._id;
            expect(response.body).to.include({
                title: 'Machine Learning',
                date: '2024-07-22T00:00:00.000Z', // ISO format
                starttime: '12:00',
                endtime: '13:00',
                repeat: false,
                user: testUserId
            });

        } catch (err) {
            console.error('Error creating class:', err.message);
            throw err;
        }
    });

    // GET CLASSES FOR THE USER
    it('should get classes for the user', async () => {
        const response = await request.get('/api/classes')
        .expect(200);

        expect(response.body).to.be.an('array');
        expect(response.body[0]).to.include({
            title: 'Machine Learning',
            date: '2024-07-22T00:00:00.000Z', // ISO format
            starttime: '12:00',
            endtime: '13:00',
            repeat: false
        });
    });
});