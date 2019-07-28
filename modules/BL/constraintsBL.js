const DAL = require('../DAL');
const config = require('../../config');
const enums = require('../enums');
const usersBL = require('../BL/usersBL');

const usersCollectionName = config.db.collections.users;
const constraintsCollectionName = config.db.collections.constraints;
const constraintsReasonsCollectionName = config.db.collections.constraintsReasons;
const statusTypeCollectionName = config.db.collections.statusType;

let self = module.exports = {
    getAllConstraints(user, sortCol, sortDirection, filter = null) {
        let findQuery = { $match: null };
        let usersJoinQuery = {$unwind : null }

        if (user.isManager) {
            findQuery["$match"] = { 'businessId': DAL.GetObjectId(user.businessId) };
        }
        else {
            findQuery["$match"] = { 'userObjId': DAL.GetObjectId(user.id) };
        }

        if(filter) {
            if(filter.statusId) {
                findQuery["$match"].statusId = filter.statusId
            }
            if(filter.description) {
                findQuery["$match"].description = filter.description
            }
        }

        usersJoinQuery = {
            $lookup:
            {
                from: usersCollectionName,
                localField: 'userObjId',
                foreignField: '_id',
                as: 'user'
            }
        }
    
        let statusTypeJoinQuery = {
            $lookup: {
                from: statusTypeCollectionName,
                localField: "statusId",
                foreignField: "statusId",
                as: "status"
            }
        };

        let sortObj;

        if (sortCol && sortDirection) {
            sortObj = { $sort: {} };

            switch (sortCol) {
                case "statusId":
                    sortObj.$sort.statusId = parseInt(sortDirection);
                    break;
                case "startDate":
                    sortObj.$sort.startDate = parseInt(sortDirection);
                    break;
            }
        }

        let aggregateQuery = [findQuery, usersJoinQuery ,statusTypeJoinQuery];
        
        if(filter && filter.userId){
            let matchUser = {$match: {"user.userId": filter.userId}};
            aggregateQuery.push(matchUser);
        }
  
        sortObj && (aggregateQuery.push(sortObj));

        return DAL.Aggregate(constraintsCollectionName, aggregateQuery);
    },

    AddConstraint(conData) {
        let newConstraintDoc = {
            "userObjId": DAL.GetObjectId(conData.userObjId),
            "businessId": DAL.GetObjectId(conData.businessId),
            "startDate": new Date(conData.startDate),
            "endDate": new Date(conData.endDate),
            "description": conData.description,
            "shifts": conData.shifts,
            "statusId": enums.ConstraintStatusEnum.WAITING
        };

        return DAL.Insert(constraintsCollectionName, newConstraintDoc);
    },

    DeleteConstraint(conObjId) {
        return DAL.DeleteOne(constraintsCollectionName, { _id: DAL.GetObjectId(conObjId) });
    },

    DeleteConstraintsByUserId(userObjId) {
        return DAL.Delete(constraintsCollectionName, { userObjId: DAL.GetObjectId(userObjId) });
    },

    DeleteConstraintsByBusinessId(businessId) {
        return DAL.Delete(constraintsCollectionName, { businessId: DAL.GetObjectId(businessId) });
    },

    ApproveConstraint(conObjId) {
        return DAL.UpdateOne(constraintsCollectionName,
            { _id: DAL.GetObjectId(conObjId) },
            {
                $set: {
                    statusId: enums.ConstraintStatusEnum.CONFIRMED
                }
            });
    },

    RefuseConstraint(conObjId) {
        return DAL.UpdateOne(constraintsCollectionName,
            { _id: DAL.GetObjectId(conObjId) },
            {
                $set: {
                    statusId: enums.ConstraintStatusEnum.REFUSED
                }
            });
    },

    GetAllConstraintReasons() {
        return DAL.Find(constraintsReasonsCollectionName);
    },

    GetBusinessConstraintsWaitAmount(businessId) {
        let filter = {
            "businessId": DAL.GetObjectId(businessId),
            "statusId": enums.ConstraintStatusEnum.WAITING
        }

        return DAL.Count(constraintsCollectionName, filter);
    },

    GetUserConstraints(userId, year, month) {
        year = parseInt(year);
        month = parseInt(month);

        return self.GetWorkersConstraints([DAL.GetObjectId(userId)], year, month);
    },

    // Get business workers constraints that begin from the asked year and month.
    GetWorkersConstraints(workersIds, year, month) {
        let constraintsWorkersFilter = {
            $match: {
                "userObjId": { $in: workersIds },
                "statusId": enums.ConstraintStatusEnum.CONFIRMED
            }
        }

        let projectObj = {
            $project: {
                userObjId: "$userObjId",
                startDate: "$startDate",
                endDate: "$endDate",
                shifts: "$shifts",
                startYear: { $year: "$startDate" },
                startMonth: { $month: "$startDate" },
                endYear: { $year: "$endDate" },
                endMonth: { $month: "$endDate" }
            }
        }

        let projectRangeObj = {
            $project: {
                userObjId: "$userObjId",
                startDate: "$startDate",
                endDate: "$endDate",
                shifts: "$shifts",
                startYear: "$startYear",
                startMonth: "$startMonth",
                endYear: "$endYear",
                endMonth: "$endMonth",
                isStartYearInRange: {
                    $lte: ["$startYear", year],
                },
                isEndYearInRange: {
                    $gte: ["$endYear", year]
                },
                isStartMonthInRange: {
                    $lte: ["$startMonth", month]
                },
                isEndMonthInRange: {
                    $gte: ["$endMonth", month]
                }
            }
        }

        let constraintsTimeFilter = {
            $match: {
                "isStartYearInRange": true,
                "isEndYearInRange": true,
                "isStartMonthInRange": true,
                "isEndMonthInRange": true
            }
        }

        let lastProject = {
            $project: {
                userObjId: "$userObjId",
                startDate: "$startDate",
                endDate: "$endDate",
                shifts: "$shifts",
            }
        }

        let aggregate = [constraintsWorkersFilter, projectObj,
            projectRangeObj, constraintsTimeFilter, lastProject];

        return DAL.Aggregate(constraintsCollectionName, aggregate);
    },

    UpdateConstraintShifts(conObjId, shifts) {
        return DAL.UpdateOne(constraintsCollectionName,
            { _id: DAL.GetObjectId(conObjId) },
            { $set: { shifts } });
    }
};
