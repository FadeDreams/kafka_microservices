package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	//import os
	"github.com/rs/cors"
	"log"
	"os"
	"strconv"
)

type OrderRequest struct {
	PStatus string `json:"pstatus"`
}
type DeductRequest struct {
	UserID int     `json:"user_id"`
	Amount float64 `json:"amount"`
}

type AddRequest struct {
	UserID int     `json:"user_id"`
	Amount float64 `json:"amount"`
}
type BuyRequest struct {
	UserID string `json:"user_id"`
	Amount string `json:"amount"`
}

func step_a(orderID int, pStatus string) bool {
	orderRequest := OrderRequest{
		PStatus: pStatus,
	}

	orderRequestJSON, _ := json.Marshal(orderRequest)

	req, err := http.NewRequest("PUT", fmt.Sprintf("http://127.0.0.1:5002/orders/%d", orderID), bytes.NewBuffer(orderRequestJSON))
	if err != nil {
		fmt.Printf("Step A failed to create request: %s\n", err)
		return false
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Step A failed: %s\n", err)
		return false
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("Step A failed with status code: %d\n", resp.StatusCode)
		return false
	}

	fmt.Println("Step A executed successfully")
	return true
}

func step_b(userID int, amount float64) bool {
	// Simulate step B
	// Perform a POST request to http://127.0.0.1:1111/api/deduct with JSON
	deductRequest := DeductRequest{
		UserID: userID,
		Amount: amount,
	}

	deductRequestJSON, _ := json.Marshal(deductRequest)
	//fmt.Printf(string(deductRequestJSON))

	resp, err := http.Post("http://127.0.0.1:1111/api/deduct", "application/json", bytes.NewBuffer(deductRequestJSON))
	if err != nil {
		fmt.Printf("Step B failed: %s\n", err)
		return false
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		fmt.Printf("Step B failed with status code: %d\n", resp.StatusCode)
		return false
	}

	fmt.Println("Step B executed successfully")
	return true
}

func BuyHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	orderIDStr := vars["id"]
	orderID, err := strconv.Atoi(orderIDStr)
	if err != nil {
		http.Error(w, "Invalid order ID", http.StatusBadRequest)
		return
	}

	// Parse the request body to get user ID and amount
	var requestBody BuyRequest
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&requestBody); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Convert string values to integers and floats
	userID, err := strconv.Atoi(requestBody.UserID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	amount, err := strconv.ParseFloat(requestBody.Amount, 64)
	if err != nil {
		http.Error(w, "Invalid amount", http.StatusBadRequest)
		return
	}

	fmt.Printf("Processing buy request for order ID %s, userID: %d, amount: %f\n", orderID, userID, amount)

	// Execute step A
	if step_a(orderID, "disable") {
		// Execute step B
		if step_b(userID, amount) {
			// Saga completed successfully
			w.WriteHeader(http.StatusOK)
			fmt.Printf("SAGA buy request successfully done with order ID %d, userID: %d, amount: %f\n", orderID, userID, amount)
		} else {
			// Step B failed, compensate for step A
			compensate_a(orderID, amount)
			http.Error(w, "Saga failed", http.StatusInternalServerError)
		}
	} else {
		// Step A failed, no need to execute step B
		http.Error(w, "Saga failed", http.StatusInternalServerError)
	}
}

func writeErrorLogToFile(errorLog string) {
	// Open a file for writing (create it if it doesn't exist)
	file, err := os.OpenFile("error_log.txt", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		fmt.Println("Error opening the error log file:", err)
		return
	}
	defer file.Close()

	// Write the error message to the file
	_, err = file.WriteString(errorLog)
	if err != nil {
		fmt.Println("Error writing to the error log file:", err)
	}
}

func compensate_a(userID int, amount float64) (bool, error) {
	// Simulate step B
	// Perform a POST request to http://127.0.0.1:1111/api/deduct with JSON
	addRequest := AddRequest{
		UserID: userID,
		Amount: amount,
	}

	addRequestJSON, _ := json.Marshal(addRequest)

	resp, err := http.Post("http://127.0.0.1:1111/api/add", "application/json", bytes.NewBuffer(addRequestJSON))
	if err != nil {
		errLog := fmt.Sprintf("Compensating step A failed: %s\n", err, addRequestJSON)
		writeErrorLogToFile(errLog)
		return false, err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		errLog := fmt.Sprintf("Compensating step A failed: %s\n", resp.StatusCode, addRequestJSON)
		writeErrorLogToFile(errLog)
		return false, err
	}

	fmt.Println("Compensating step A was successfull")
	return true, err
}

func main() {
	//compensate_a(1, 100)
	//writeErrorLogToFile("sss")
	router := mux.NewRouter()

	router.HandleFunc("/buy/{id:[0-9]+}", BuyHandler).Methods("POST")
	// Create a CORS handler with your desired configuration
	//cors optionsGoes Below
	corsOpts := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:8080"}, //you service is available and allowed for this base url
		AllowedMethods: []string{
			http.MethodGet, //http methods for your app
			http.MethodPost,
			http.MethodPut,
			http.MethodPatch,
			http.MethodDelete,
			http.MethodOptions,
			http.MethodHead,
		},

		AllowedHeaders: []string{
			"*", //or you can your header key values which you are using in your application
		},
	})

	log.Fatal(http.ListenAndServe(":8081", corsOpts.Handler(router)))

}
