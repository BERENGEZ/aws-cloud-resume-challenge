import json
import boto3

#Initialize the DynamoDB client
dynamodb = boto3.resource('dynamodb', region_name='eu-north-1') 
table = dynamodb.Table('cloud-resume-counter') # Change to your region

def lambda_handler(event, context):
    try:
        # Increment the visitor counter in DynamoDB
        response = table.update_item(
            Key={'id': 'visitors'},
            UpdateExpression='SET version_count = if_not_exists(version_count, :start) + :inc',
            ExpressionAttributeValues={
                ':inc': 1,
                ':start': 0
            },
            ReturnValues='UPDATED_NEW'
        )
        #Extract the updated count number
        views = int(response['Attributes']['version_count'])
        
        #Return  a success response with CORS headers allowed
        return{
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, OPTIONS'
            },
            'body':json.dumps({'count': views})
            }
        
    except Exception as e:
        print(f"Error updating the counter: {str(e)}")
        return {
            'statusCode': 500,
            'headers':{
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Internal Server Error'})
        }
               
 #The Logic in this code is to wake up, read the counter from DynamoDB add +1 and save it back to DynamoDB. Then return the new count number as a response.
 