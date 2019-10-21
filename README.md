# # First stage: start with a Golang base image
FROM golang:1.12-alpine3.10

# Move to the directory where the source code will live
WORKDIR /go/src/hello

# Copy the source code into the current directory
COPY . .

# Get any dependencies, and compile the code
RUN CGO_ENABLED=0 go get -v ./...

RUN wget -c https://releases.hashicorp.com/envconsul/0.9.0/envconsul_0.9.0_linux_amd64.tgz && \
    tar -xvzf envconsul_0.9.0_linux_amd64.tgz

# Second stage: start from an empty base image
FROM scratch

# Copy the binary from the first stage
COPY --from=0 /go/bin/hello /
COPY --from=0 /go/src/hello /

# Tell Docker what executable to run by default when starting this container
ENTRYPOINT ["/envconsul","-config=/vault/config.hcl","-secret=secret/test","/hello"]


package main
import (
    "fmt"
    "os"
)

func main() {
    fmt.Println("FOO:", os.Getenv("FOO"))
}
