import React from "react";
import TextField from "@mui/material/TextField";


export const GithubAction = ({observable, index, updateFieldWithValue}: any) => (<>
<TextField
                  id="outlined-basic"
                  label="owner"
                  variant="outlined"
                  value={observable.owner}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    updateFieldWithValue("owner", index, event.target.value)
                  }
                />
                <TextField
                  id="outlined-basic"
                  label="repo"
                  variant="outlined"
                  value={observable.repo}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    updateFieldWithValue("repo", index, event.target.value)
                  }
                />
                <TextField
                  id="outlined-basic"
                  label="Workflow Name"
                  variant="outlined"
                  value={observable.workflowId}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    updateFieldWithValue(
                      "workflowId",
                      index,
                      event.target.value
                    )
                  }
                />
                <TextField
                  id="outlined-basic"
                  label="authorization Token"
                  variant="outlined"
                  type="password"
                  value={observable.authToken}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    updateFieldWithValue("authToken", index, event.target.value)
                  }
                />
</>)