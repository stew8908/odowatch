# The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from firebase_functions import firestore_fn, https_fn

# The Firebase Admin SDK to access Cloud Firestore.
from firebase_admin import initialize_app, firestore, auth
import google.cloud.firestore
import uuid

app = initialize_app()


# @https_fn.on_call()
# def example(data):
#     print(data.data)
#     return "Hello World"

@https_fn.on_call()
def invite_user_to_vehicle(request):
    print(request.data)
    data = request.data
    db: google.cloud.firestore.Client = firestore.client()
    vehicle_id = data.get('vehicleId')
    user_email = data.get('userEmail').lower()  # Get the user's email from the request and convert to lowercase
    print(user_email)
    # Check if the user is authenticated
    if request.auth is None:
        raise https_fn.HttpsError('unauthenticated', 'User must be authenticated to invite another user.')
    else:
        print('user was good to go')
    
    # Look up the user ID based on the provided email
    user = auth.get_user_by_email(user_email)
    print('Successfully fetched user data: {0}'.format(user.uid))

    
    if not user:
        print('user not found')
        raise https_fn.HttpsError('not-found', 'User not found with the provided email.')

    invited_user_id = user.uid  # Get the user ID from the query result
    print("id"+ invited_user_id)
    # Get the vehicle document
    vehicle_ref = db.collection('vehicles').document(vehicle_id)
    vehicle_doc = vehicle_ref.get()

    if not vehicle_doc.exists:
        raise https_fn.HttpsError('not-found', 'Vehicle not found.')

    inviter_id = request.auth.uid  # Get the ID of the authenticated user who is inviting
    data = {  # Create a new invite document
        'vehicleId': vehicle_id,
        'inviterId': inviter_id,
        'invitedUserId': invited_user_id
    }

    invites_ref = db.collection('invites')
    update_time, invite_ref = invites_ref.add(data)
    print(invite_ref)
    invite_id = invite_ref.id  # Use the document ID as the invite ID
    print (' id sored')
    # Add the user to the vehicle's invited users list
    vehicle_ref.update({
        'pendingInvites': firestore.ArrayUnion([invite_id]),
    })

    # Add the vehicle ID, inviter's user ID, and invite ID to the user's pending invites list

    user_ref = db.collection('users').document(invited_user_id)
    user_ref.update({
        'pendingInvites': firestore.ArrayUnion([{
            'inviteId': invite_id,  # Store the unique invite ID
            'vehicleId': vehicle_id,
            'inviterId': inviter_id  # Store the ID of the user who invited them
        }])  # Assuming pendingInvites is an array in the user document
    })

    return {'success': True, 'message': 'User invited successfully.', 'inviteId': invite_id}

@https_fn.on_call()
def accept_invitation(data, context):
    db: google.cloud.firestore.Client = firestore.client()
    invite_id = data.get('inviteId')
    user_id = context.auth.uid  # Get the ID of the authenticated user

    # Check if the user is authenticated
    if context.auth is None:
        raise https_fn.HttpsError('unauthenticated', 'User must be authenticated to accept an invitation.')

    try:
        # Find the user's document
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()

        if not user_doc.exists:
            raise https_fn.HttpsError('not-found', 'User not found.')

        # Find the invite in the pending invites
        pending_invites = user_doc.to_dict().get('pendingInvites', [])
        invite = next((invite for invite in pending_invites if invite['inviteId'] == invite_id), None)

        if not invite:
            raise https_fn.HttpsError('not-found', 'Invite not found.')

        # Add the vehicle ID to the user's shared vehicles list
        vehicle_id = invite['vehicleId']  # Get the vehicle ID from the invite
        user_ref.update({
            'sharedVehicles': firestore.ArrayUnion([vehicle_id])  # Assuming sharedVehicles is an array in the user document
        })

        # Remove the invite from pending invites
        pending_invites.remove(invite)
        user_ref.update({'pendingInvites': pending_invites})

        return {'success': True, 'message': 'Invitation accepted successfully.'}
    except Exception as e:
        raise https_fn.HttpsError('internal', str(e))

@https_fn.on_call()
def decline_invitation(data, context):
    db: google.cloud.firestore.Client = firestore.client()
    invite_id = data.get('inviteId')
    user_id = context.auth.uid  # Get the ID of the authenticated user

    # Check if the user is authenticated
    if context.auth is None:
        raise https_fn.HttpsError('unauthenticated', 'User must be authenticated to decline an invitation.')

    try:
        # Find the user's document
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()

        if not user_doc.exists:
            raise https_fn.HttpsError('not-found', 'User not found.')

        # Find the invite in the pending invites
        pending_invites = user_doc.to_dict().get('pendingInvites', [])
        invite = next((invite for invite in pending_invites if invite['inviteId'] == invite_id), None)

        if not invite:
            raise https_fn.HttpsError('not-found', 'Invite not found.')

        # Remove the invite from pending invites
        pending_invites.remove(invite)
        user_ref.update({'pendingInvites': pending_invites})

        return {'success': True, 'message': 'Invitation declined successfully.'}
    except Exception as e:
        raise https_fn.HttpsError('internal', str(e))