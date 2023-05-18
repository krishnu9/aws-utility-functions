const aws = require("aws-sdk");

const ddbGetClient = () => new aws.DynamoDB({ apiVersion: "2012-08-10" });

const ddbEncode = (item, verbose = false) => {
  verbose && console.log("ddbEncode - input -", item);
  try {
    const json = aws.DynamoDB.Converter.marshall(item);
    if (verbose) {
      console.log("ddbEncode - success -", json);
    }
    return json;
  } catch (err) {
    if (verbose) {
      console.log("ddbEncode - error -", err);
    }
    throw err;
  }
};

const ddbDecode = (item, verbose = false) => {
  verbose && console.log("ddbDecode - input -", item);
  try {
    const json = aws.DynamoDB.Converter.unmarshall(item);
    if (verbose) {
      console.log("ddbDecode - success -", json);
    }
    return json;
  } catch (err) {
    if (verbose) {
      console.log("ddbDecode - error -", err);
    }
    throw err;
  }
};

const ddbQuery = async (
  tableName,
  indexName = null,
  keyConditionExpression = null,
  expressionAttributeNames = null,
  expressionAttributeValues = null,
  limit = 999,
  maxLimit = null,
  scanIndexForward = false,
  isFetchAll = false,
  projectionExpression = null,
  verbose = true
) => {
  let results = [];
  const params = {
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: keyConditionExpression, // "aws = :e AND begins_with ( cEmail, :t )",
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    Limit: limit,
    ScanIndexForward: scanIndexForward,
  };
  if (projectionExpression) {
    params.ProjectionExpression = projectionExpression;
  }
  if (verbose) {
    console.log("ddbQuery - params - ", params);
  }
  do {
    try {
      const ddb = await ddbGetClient();
      const response = await ddb.query(params).promise();
      results = results.concat(response.Items);
      if (!response.LastEvaluatedKey) {
        break;
      }
      if (maxLimit && response.length >= maxLimit) {
        if (verbose) {
          console.log(`ddbQuery - maxLimit: ${maxLimit} reached - break`);
        }
        break;
      }
      params.ExclusiveStartKey = response.LastEvaluatedKey;
      if (verbose) {
        console.log("ddbQuery - found next token -", response.LastEvaluatedKey);
      }
    } catch (err) {
      if (verbose) {
        console.log("ddbQuery - error -", err);
      }
      throw err;
    }
  } while (isFetchAll);
  if (verbose) {
    console.log(`ddbQuery - success - ${results.length} found`);
  }
  return results;
};

const ddbGetItem = async (tableName, key, verbose = true) => {
  const params = {
    TableName: tableName,
    Key: key,
  };
  if (verbose) {
    console.log("ddbGetItem - params - ", params);
  }
  try {
    const ddb = await ddbGetClient();
    const response = await ddb.getItem(params).promise();
    if (verbose) {
      console.log("ddbGetItem - success - ", response);
    }
    return response;
  } catch (err) {
    if (verbose) {
      console.log("ddbGetItem - error - ", err);
    }
    throw err;
  }
};

const ddbPutItem = async (tableName, item, verbose = true) => {
  const params = {
    TableName: tableName,
    Item: item,
  };
  if (verbose) {
    console.log("ddbPutItem - params - ", params);
  }
  try {
    const ddb = await ddbGetClient();
    const response = await ddb.putItem(params).promise();
    if (verbose) {
      console.log("ddbPutItem - success - ", JSON.stringify(response, null, 2));
    }
    return response;
  } catch (err) {
    if (verbose) {
      console.log("ddbPutItem - error - ", err);
    }
    throw err;
  }
};

const ddbUpdateItem = async (
  tableName,
  key,
  updateExpression,
  expressionAttributeNames,
  expressionAttributeValues,
  verbose = true
) => {
  const params = {
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "UPDATED_NEW",
  };
  if (verbose) {
    console.log("ddbUpdateItem - params - ", params);
  }
  try {
    const ddb = await ddbGetClient();
    const response = await ddb.updateItem(params).promise();
    if (verbose) {
      console.log(
        "ddbUpdateItem - success - ",
        JSON.stringify(response, null, 2)
      );
    }
    return response;
  } catch (err) {
    if (verbose) {
      console.log("ddbUpdateItem - error - ", err);
    }
    throw err;
  }
};

const ddbDeleteItem = async (tableName, key, verbose = true) => {
  const params = {
    TableName: tableName,
    Key: key,
  };
  if (verbose) {
    console.log("ddbDeleteItem - params - ", params);
  }
  try {
    const ddb = await ddbGetClient();
    const response = await ddb.deleteItem(params).promise();
    if (verbose) {
      console.log(
        "ddbDeleteItem - success - ",
        JSON.stringify(response, null, 2)
      );
    }
    return response;
  } catch (err) {
    if (verbose) {
      console.log("ddbDeleteItem - error - ", err);
    }
    throw err;
  }
};

module.exports = {
  ddbEncode,
  ddbDecode,
  ddbQuery,
  ddbGetItem,
  ddbPutItem,
  ddbUpdateItem,
  ddbDeleteItem,
};
