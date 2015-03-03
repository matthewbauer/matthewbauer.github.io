package main

import (
	"net"
	"net/http"
	"net/http/fcgi"
	"database/sql"
	"strings"
	"fmt"
	"strconv"
	"encoding/json"
	_ "github.com/go-sql-driver/mysql"
)

type FastCGIServer struct{}

type Credit struct {
	Test string
	Score int
	Credit int
	Class string
}

type College struct {
	Name string
	Credits []Credit
}

var aptests = [...]string{
	"Art History",
	"Biology",
	"Calculus AB",
	"Calculus BC",
	"Chemistry",
	"Chinese Language and Culture",
	"Comparative Government and Politics",
	"Computer Science A",
	"English Language and Composition",
	"English Literature and Composition",
	"Environmental Science",
	"European History",
	"French Language",
	"German Language",
	"Human Geography",
	"Italian Language and Culture",
	"Japanese Language and Culture",
	"Latin",
	"Macroeconomics",
	"Microeconomics",
	"Music Theory",
	"Physics B",
	"Physics C: Mechanics",
	"Physics C: Electricity and Magnetism",
	"Psychology",
	"Spanish Language",
	"Spanish Literature",
	"Statistics",
	"Studio Art: 2-D Design Portfolio",
	"Studio Art: 3-D Design Portfolio",
	"Studio Art: Drawing Portfolio",
	"U.S. History",
	"U.S. Government and Politics",
	"World History",
}

func (s FastCGIServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	conn, err := sql.Open("mysql", "matthew@tcp(apcredits.ccpuvvzgbdch.us-west-2.rds.amazonaws.com:3306)/apcredits")
	defer conn.Close()

	if err != nil {
		fmt.Println(err)
		return
	}

	tests := make(map[string]int)
	//r.parseForm()
	empty := 0
	for i := 1; empty < 5; i++ {
		test := r.PostFormValue(fmt.Sprintf("test%v", i))
		if test == "" {
			empty ++
			continue
		}
		t, err := strconv.Atoi(test)
		if err != nil {
			fmt.Println(err)
			continue
		}
		empty = 0

		score := r.PostFormValue(fmt.Sprintf("score%v", i))

		n, err := strconv.Atoi(score)
		if err != nil {
			fmt.Println(err)
			continue
		}

		tests[aptests[t]] = n
	}

	colleges := make(map[string]*College)

	for test, score := range tests {
		rows, err := conn.Query("select college, credit, _class from credit where credit>0 and test=? and score<=?", test, score)
		if err != nil {
			fmt.Println(err)
			continue
		}
		for rows.Next() {
			var collegename string
			var numcredit int
			var class string
			if err := rows.Scan(&collegename, &numcredit, &class); err != nil {
				fmt.Println(err)
				return
			}

			collegename = strings.Replace(collegename, "\x92", "'", -1)
			class = strings.Replace(class, "\xa0", " ", -1)

			if colleges[collegename] == nil {
				colleges[collegename] = &College{Name: collegename,}
			}

			credit := Credit{Test: test, Score: score, Credit: numcredit, Class: class,}

			found_index := -1
			for index, credit := range colleges[collegename].Credits {
				if credit.Test == test {
					found_index = index
					break
				}
			}
			if found_index == -1 {
				colleges[collegename].Credits = append(colleges[collegename].Credits, credit)
			} else if colleges[collegename].Credits[found_index].Score < score {
				colleges[collegename].Credits = append(colleges[collegename].Credits[:found_index], colleges[collegename].Credits[found_index+1:]...)
				colleges[collegename].Credits = append(colleges[collegename].Credits, credit)
			}
		}
		if err := rows.Err(); err != nil {
			fmt.Println(err)
			return
		}
	}

	data, err := json.Marshal(colleges)
	if err != nil {
		fmt.Println(err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}

func main() {
	fmt.Println("starting")
	listener, err := net.Listen("tcp", ":9001")
	if err != nil {
		fmt.Println(err)
		return
	}
	srv := new(FastCGIServer)
	fcgi.Serve(listener, srv)
	fmt.Println("quiting")
}