docker-compose up 


http://localhost        ← React frontend
http://localhost:8000   ← FastAPI backend
http://localhost:8000/docs ← Swagger UI     



##  without  docker  

###  for  the  backend   

uvicorn backend.main:app --reload --port 8000   

### for  the frontend    

npm run  dev   


