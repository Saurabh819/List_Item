const request = require('supertest');
const app = require('../app'); 
const { MyListModel, MovieModel, TVShowModel } = require('../models');

describe('addToMyList controller', () => {
  beforeEach(async () => {
   
    await MyListModel.deleteMany({});
    await MovieModel.deleteMany({});
    await TVShowModel.deleteMany({});
  });

  
  it('should add media to mylist when all required parameters are provided and media does not exist in the list', async () => {
    const mockMedia = { _id: 'mockMediaId', title: 'Mock Media Title' };
    await MovieModel.create(mockMedia);

   
    const response = await request(app)
      .post('/add-to-my-list')
      .send({ userId: 'mockUserId', mediaId: mockMedia._id, mediaType: 'movie' });

 
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('MOVIE \'Mock Media Title\' added to mylist successfully');

   
    const mylistItem = await MyListModel.findOne({ userId: 'mockUserId', mediaId: mockMedia._id });
    expect(mylistItem).toBeTruthy();
  });

  it('should return error when media already exists in the user\'s list', async () => {
    
    const mockMedia = { _id: 'mockMediaId', title: 'Mock Media Title' };
    await MovieModel.create(mockMedia);
    await MyListModel.create({ userId: 'mockUserId', mediaId: mockMedia._id, mediaType: 'movie', mediaTitle: 'Mock Media Title' });

   
    const response = await request(app)
      .post('/add-to-my-list')
      .send({ userId: 'mockUserId', mediaId: mockMedia._id, mediaType: 'movie' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Media already exists in the list');
  });



 
  it('should return error when one or more required parameters are missing', async () => {
    const response = await request(app)
      .post('/add-to-my-list')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid request body');
  });

  it('should return error when an invalid media type is provided', async () => {
    const response = await request(app)
      .post('/add-to-my-list')
      .send({ userId: 'mockUserId', mediaId: 'mockMediaId', mediaType: 'invalidMediaType' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid media type');
  });

  
});
