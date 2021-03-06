import { Router } from 'express';
import { Sequelize } from 'sequelize';

var router = Router();

var sequelize = new Sequelize('mariadb://flasca50:0625150@localhost:3306/flasca50');


var uc1 =" select \
    a.FirstName as `First Name`, \
    a.LastName as `Last Name`, \
    a.Email, \
    s.Name as `Home University`, \
    priority1.Name as `First Choice`, \
    priority2.Name as `Second Choice` \
from \
    Accounts as a \
    inner join InboundInfo as ii on ii.AccountId = a.Id \
    inner join HomeSchool as hs on hs.Accounts_Id = a.Id \
    inner join Schools as s on hs.Schools_Id = s.Id \
    inner join ApplicationAnswers as aa on aa.AccountId = a.Id \
    inner join SchoolsWishlist as sw on aa.Id = sw.AnswersId \
    inner join ( \
        select \
            s.Name as Name, \
            sw.AnswersId as AnswersId \
        from \
            SchoolsWishlist as sw \
            inner join Schools as s on sw.SchoolId = s.Id \
        where \
            sw.Priority = 1 \
    ) as priority1 on priority1.AnswersId = sw.AnswersId \
    inner join ( \
        select \
            s.Name as Name, \
            sw.AnswersId as AnswersId \
        from \
            SchoolsWishlist as sw \
            inner join Schools as s on sw.SchoolId = s.Id \
        where \
            sw.Priority = 2 \
    ) as priority2 on priority2.AnswersId = sw.AnswersId \
order by \
    hs.Schools_Id;"

var uc2 =" select \
    a.FirstName as `First Name`, \
    a.LastName as `Last Name`, \
    a.Email, \
    s.Name as `Home University`, \
    priority1.Name as `First Choice`, \
    priority2.Name as `Second Choice` \
from \
    Accounts as a \
    inner join OutboundInfo as ii on ii.AccountId = a.Id \
    inner join HomeSchool as hs on hs.Accounts_Id = a.Id \
    inner join Schools as s on hs.Schools_Id = s.Id \
    inner join ApplicationAnswers as aa on aa.AccountId = a.Id \
    inner join SchoolsWishlist as sw on aa.Id = sw.AnswersId \
    inner join ( \
        select \
            s.Name as Name, \
            sw.AnswersId as AnswersId \
        from \
            SchoolsWishlist as sw \
            inner join Schools as s on sw.SchoolId = s.Id \
        where \
            sw.Priority = 1 \
    ) as priority1 on priority1.AnswersId = sw.AnswersId \
    inner join ( \
        select \
            s.Name as Name, \
            sw.AnswersId as AnswersId \
        from \
            SchoolsWishlist as sw \
            inner join Schools as s on sw.SchoolId = s.Id \
        where \
            sw.Priority = 2 \
    ) as priority2 on priority2.AnswersId = sw.AnswersId \
order by \
    hs.Schools_Id;"

var uc3 = "select \
    a.FirstName as `First Name`, \
    a.LastName as `Last Name`, \
    a.Email, \
    s.Term \
from \
    Accounts as a \
    inner join Students as s on a.Id = s.AccountId \
order by \
    s.Term;"


var uc4 = "select  \
    a.FirstName as `First Name`, \
    a.LastName as `Last Name`, \
    r.RoleName as `Role`, \
    s.Name as `Home University` \
from \
    Accounts as a \
    inner join Roles as r on r.Id = a.RoleId \
    inner join HomeSchool as hs on a.Id = hs.Accounts_Id \
    inner join Schools as s on hs.Schools_Id = s.Id \
    inner join Addresses as ad on s.AddressId = ad.Id \
where \
    (r.Id = 2 or r.Id = 3) \
    and \
    ad.Country = 'United States' \
order by \
    s.Id;"

function getQuery(req,res,next){
    var qID = parseInt(req.params.id);
    switch(qID){
        case 0: var query = uc1;
                break;
        case 1: var query = uc2;
                break;
        case 2: var query = uc3;
                break;
        case 3: var query = uc4;
                break;
        default:
                var query = uc1;
    }
    sequelize.query(query, { type: sequelize.QueryTypes.SELECT})
    .then(function(data) {
        res.status(200)
        .json(data);
    })
    .catch(err => {
        return next(err);
    });
}

// Mock Users
const useCases = [
    { id: 0, name: 'Use Case 1', desc: 'All Hessen students and their UW choices.' },
    { id: 1, name: 'Use Case 2', desc: 'All UW students and their Hessen choices.' },
    { id: 2, name: 'Use Case 3', desc: 'All UW students and their application terms.' },
    { id: 3, name: 'Use Case 5', desc: 'All UW staff members and their campuses' }
];

/* GET users listing. */
router.get('/usecases', function (req, res, next) {
    res.json(useCases);
});

/* GET user by ID. */
router.get('/usecases/:id', getQuery);

export default router;
