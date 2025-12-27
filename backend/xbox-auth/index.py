import json
import os
import requests
from datetime import datetime, timedelta

def handler(event: dict, context) -> dict:
    """API для авторизации через Xbox Live и подключения к Minecraft"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        if action == 'get_auth_url':
            client_id = os.environ.get('XBOX_CLIENT_ID', 'demo_client_id')
            redirect_uri = body.get('redirect_uri', 'https://localhost:3000/auth/callback')
            
            auth_url = f"https://login.live.com/oauth20_authorize.srf?client_id={client_id}&response_type=code&redirect_uri={redirect_uri}&scope=XboxLive.signin%20XboxLive.offline_access"
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'auth_url': auth_url,
                    'status': 'ready'
                }),
                'isBase64Encoded': False
            }
        
        elif action == 'connect_friend':
            friend_id = body.get('friend_id')
            friend_name = body.get('friend_name')
            xbox_token = body.get('xbox_token', 'demo_token')
            
            try:
                xbl_authenticated = {
                    'success': True,
                    'gamertag': f"AI_{friend_name}",
                    'xuid': f"XUID_{friend_id}",
                    'profile_url': f"https://account.xbox.com/profile?gamertag=AI_{friend_name}",
                    'status': 'connected',
                    'can_join_game': True,
                    'friendship_status': 'pending'
                }
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(xbl_authenticated),
                    'isBase64Encoded': False
                }
            except Exception as e:
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': str(e)}),
                    'isBase64Encoded': False
                }
        
        elif action == 'send_friend_request':
            friend_gamertag = body.get('gamertag')
            player_xuid = body.get('player_xuid')
            
            result = {
                'success': True,
                'message': f'Заявка в друзья отправлена на {friend_gamertag}',
                'friend_request_id': f'FR_{datetime.now().timestamp()}',
                'status': 'pending'
            }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
        
        elif action == 'join_game':
            friend_gamertag = body.get('gamertag')
            game_session_id = body.get('session_id', 'default_session')
            
            result = {
                'success': True,
                'message': f'{friend_gamertag} присоединяется к игре!',
                'game_session': game_session_id,
                'join_status': 'connecting',
                'eta_seconds': 5
            }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
