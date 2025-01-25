import pandas as pd
import cv2
import urllib.request
import numpy as np
import os
from datetime import datetime
import face_recognition

path = r'D:\\Kashif\\Delete\\Smartpick-ML - Copy\\assets\\img\\Parent';
dataPath = r'.\\assets\\data\\'

import sqlite3


connection = sqlite3.connect('db\\db.sqlite')

# URL for camera feed
url = 'http://192.168.193.105/cam-hi.jpg'

data = pd.read_csv(dataPath+'data.csv')

if not os.path.exists(dataPath+'Detected.csv'):
    df_detected = pd.DataFrame(columns=['Parents_Name', 'Child_Name', 'timestamp'])
    df_detected.to_csv(dataPath+'Detected.csv', index=False)

images = []
classNames = []
myList = os.listdir(path)
print("Reference Images List:", myList)
for cl in myList:
    curImg = cv2.imread(f'{path}/{cl}')
    images.append(curImg)
    classNames.append(os.path.splitext(cl)[0])
print("Class Names:", classNames)

# Function to encode reference images
def findEncodings(images):
    encodeList = []
    for img in images:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encode = face_recognition.face_encodings(img)[0]
        encodeList.append(encode)
    return encodeList



def linkFaces(Parents_Name, Child_Name):

    try:
        df_detected = pd.read_csv(dataPath+'Detected.csv')
    except FileNotFoundError:
   
        df_detected = pd.DataFrame(columns=['Parents_Name', 'Child_Name', 'timestamp'])
    
    if ((df_detected['Parents_Name'] == Parents_Name) & (df_detected['Child_Name'] == Child_Name)).any():
        print(f"Duplicate entry: {Parents_Name} and {Child_Name} already exist.")
        return 
  

    print(len(df_detected))
    if len(df_detected) >= 10:

        rows_to_remove = len(df_detected) - 9
        df_detected = df_detected.iloc[rows_to_remove:]
    

    now = datetime.now()
    timestamp = now.strftime('%Y-%m-%d %H:%M:%S')
    

    new_row = pd.DataFrame({'Parents_Name': [Parents_Name], 'Child_Name': [Child_Name], 'timestamp': [timestamp]})
    
   
    df_detected = pd.concat([df_detected, new_row], ignore_index=True)
    
    df_detected.to_csv(dataPath+'Detected.csv', index=False)


encodeListKnown = findEncodings(images)
print('Encoding Complete')



def find_parent(name):
    try:
        # Fetch from SQLite database
        query = f"SELECT child_name FROM records WHERE parent_name = '{name}';"
        result = pd.read_sql_query(query, connection)
        if not result.empty:
            return result.iloc[0]['child_name']
        return "UNKNOWN"
    except Exception as e:
        print(f"Error fetching parent from database: {e}")
        return "UNKNOWN"
    

while True:

    img_resp = urllib.request.urlopen(url)
    imgnp = np.array(bytearray(img_resp.read()), dtype=np.uint8)
    img = cv2.imdecode(imgnp, -1)
    imgS = cv2.resize(img, (0, 0), None, 0.25, 0.25)
    imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

    
    facesCurFrame = face_recognition.face_locations(imgS)
    encodesCurFrame = face_recognition.face_encodings(imgS, facesCurFrame)

    for encodeFace, faceLoc in zip(encodesCurFrame, facesCurFrame):
        matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
        faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
        matchIndex = np.argmin(faceDis)

        if matches[matchIndex]:
            name = classNames[matchIndex]
            print("Detected Face:", name)

       
        
        linked_name = find_parent(name)
        
        
                    

           
        y1, x2, y2, x1 = faceLoc
        y1, x2, y2, x1 = y1 * 4, x2 * 4, y2 * 4, x1 * 4
        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.rectangle(img, (x1, y2 - 35), (x2, y2), (0, 255, 0), cv2.FILLED)
        cv2.putText(img, name, (x1 + 6, y2 - 6), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)

        linkFaces(name, linked_name)

    cv2.imshow('Webcam', img)
    
    key = cv2.waitKey(5)
    if key == ord('q'):
        break

cv2.destroyAllWindows()
