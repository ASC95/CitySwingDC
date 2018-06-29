const { renderAnnouncements } = root_require('server/routes/schedule');

describe('render_announcements(req, res, next),', () => {

  /*
  Ideally, I would test each piece of the configuration (i.e. test the api version separately
  from the node number, the edge number, etc. but that's a little extreme for the scope of this project.
  Also, I shouldn't run integration tests with unit tests but its okay for the scope of this project. These
  aren't technically proper integration tests either.
  */
  describe('defined configuration settings,', () => {

    it('should respond with some JSON that contains the "data" property via the res object', (done) => {
      let req = {};
      let next = {};
      let res = {};
      const spy = jasmine.createSpy('res spy');
      res.send = spy;
      renderAnnouncements(req, res, next).then(data => {
        expect(spy).toHaveBeenCalledWith('what');
        done();
      }, err => {
        throw new Error('Promise should not have rejected');
      });
    });

  });

  describe('invalid configuration settings', () => {
  
  });

});
