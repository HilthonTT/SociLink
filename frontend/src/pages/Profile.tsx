import { Fragment, useEffect, useState } from "react";
import { User } from "../models/user";
import { Thread } from "../models/thread";
import { useNavigate, useParams } from "react-router-dom";
import { IUserEndpoint, UserEndpoint } from "../endpoints/userEndpoint";
import { IThreadEndpoint, ThreadEndpoint } from "../endpoints/threadEndpoint";
import { auth } from "../firebase/firebase";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CssBaseline,
  Grid,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";

export const Profile = () => {
  const { id } = useParams();

  const userEndpoint: IUserEndpoint = new UserEndpoint();
  const threadEndpoint: IThreadEndpoint = new ThreadEndpoint();
  const initialThreadLimit = 10;
  const loadMoreCount = 10;
  const navigate = useNavigate();

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [visibleThreads, setVisibleThreads] =
    useState<number>(initialThreadLimit);

  const handleSeeMoreThreads = () => {
    setVisibleThreads(
      (prevVisibleThreads) => prevVisibleThreads + loadMoreCount
    );
  };

  const loadAccountPage = () => {
    navigate("/Account");
  };

  const formatThreadDate = (thread: Thread): string => {
    const threadDate = thread.dateCreated;
    const formattedDate = threadDate
      ? new Date(threadDate).toLocaleDateString()
      : "N/A";

    return formattedDate;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/");
        return;
      }

      const u = await userEndpoint.getUserFromAuth(currentUser?.uid);
      setLoggedInUser(u);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getProfileUser = async () => {
      const user = await userEndpoint.getUserAsync(id as string);
      setProfileUser(user);
    };

    getProfileUser();
  }, [id]);

  useEffect(() => {
    const getThreads = async () => {
      try {
        const fetchedThreads = await threadEndpoint.getUserThreadAsync(
          id as string
        );
        setThreads(fetchedThreads);

        console.log(fetchedThreads);
      } catch (error) {
        console.error(error);
      }
    };

    getThreads();
  }, [id]);

  useEffect(() => {
    const dateCreated = profileUser?.dateCreated;
    const formattedDate = dateCreated
      ? new Date(dateCreated).toLocaleDateString()
      : "N/A";

    setFormattedDate(formattedDate);
  }, [profileUser]);

  return (
    <div>
      <CssBaseline />
      <Grid
        sx={{ marginTop: 1, marginBottom: 3 }}
        container
        spacing={5}
        justifyContent="center"
        alignItems="flex-end">
        <Grid item key={loggedInUser?.displayName} xs={12}>
          <Card sx={{ width: "100%" }}>
            <CardHeader
              title={loggedInUser?.displayName}
              titleTypographyProps={{ align: "center" }}
              subheaderTypographyProps={{
                align: "center",
              }}
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.grey[200]
                    : theme.palette.grey[700],
              }}
            />
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  mb: 2,
                }}>
                {profileUser?.downloadUrl ? (
                  <Avatar
                    src={profileUser.downloadUrl}
                    alt={profileUser.displayName}
                    sx={{ width: 80, height: 80 }}
                  />
                ) : (
                  <Avatar sx={{ width: 80, height: 80 }}>
                    {profileUser?.displayName[0]}
                  </Avatar>
                )}
                <Typography component="h2" variant="h3" color="text.primary">
                  {loggedInUser?.displayName}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Typography component="h2" variant="h6" color="text.primary">
                  Joined on {formattedDate}
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              {profileUser?._id === loggedInUser?._id && (
                <Button fullWidth variant="contained" onClick={loadAccountPage}>
                  View Account
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Fragment>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          {loggedInUser?.displayName}'s Threads{" "}
          {`[ ${threads ? threads.length : "0"} ]`}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>User Votes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {threads?.slice(0, visibleThreads).map((thread) => (
              <TableRow key={thread._id}>
                <TableCell>{formatThreadDate(thread)}</TableCell>
                <TableCell>{thread.thread}</TableCell>
                <TableCell>{thread.author.displayName}</TableCell>
                <TableCell>{thread.userVotes.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {threads && threads.length > visibleThreads && (
          <Link
            color="primary"
            href="#"
            onClick={handleSeeMoreThreads}
            sx={{ mt: 3 }}>
            See more threads
          </Link>
        )}
      </Fragment>
    </div>
  );
};
