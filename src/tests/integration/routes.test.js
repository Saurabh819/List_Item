const request = require('supertest');
const app = require('../app'); 
const { MyListModel } = require('../models');

describe('MyList routes', () => {
  beforeEach(async () => {
   
    await MyListModel.deleteMany({});
  });


  it('should add media to mylist when valid data is provided', async () => {
    const response = await request(app)
      .post('/addtomylist')
      .send({ userId: 'mockUserId', mediaId: 'mockMediaId', mediaType: 'movie' });

    expect(response.status).toBe(201);
    expect(response.body.message).toContain('added to mylist successfully');
    const mylistItem = await MyListModel.findOne({ userId: 'mockUserId', mediaId: 'mockMediaId' });
    expect(mylistItem).toBeTruthy();
  });

 
  it('should remove media from mylist when valid ID is provided', async () => {
    const mockListItem = await MyListModel.create({ userId: 'mockUserId', mediaId: 'mockMediaId', mediaType: 'movie' });

    const response = await request(app)
      .delete(`/removefrommylist/${mockListItem._id}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Media removed from mylist successfully');
    const mylistItem = await MyListModel.findById(mockListItem._id);
    expect(mylistItem).toBeFalsy();
  });


  it('should return all media from mylist', async () => {
    await MyListModel.create([
      { userId: 'mockUserId', mediaId: 'mockMediaId1', mediaType: 'movie' },
      { userId: 'mockUserId', mediaId: 'mockMediaId2', mediaType: 'tvshow' },
    ]);

    const response = await request(app)
      .get('/getallfrommylist')
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2); 
  });
});
