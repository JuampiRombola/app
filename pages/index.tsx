import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import styles from "./styles.module.css";
import Link from "next/link";

const COPYRIGHT = `© ${new Date().getFullYear()} Exa Labs SAS`;

export default function Home() {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("sm"));

  return (
    <Box
      display="flex"
      alignItems="center"
      minHeight="90vh"
      sx={mobile ? {} : { justifyContent: "center" }}
      flexDirection="column"
    >
      <Box
        display="flex"
        flexDirection="column"
        sx={
          mobile
            ? { marginTop: 4, marginX: 2 }
            : {
                marginLeft: 8,
                marginY: 10,
              }
        }
      >
        <Box display="flex" gap={2} flexWrap={mobile ? "wrap" : "nowrap"}>
          <Box
            sx={
              mobile
                ? {}
                : {
                    display: "flex",
                    flexDirection: "column",
                    width: 632,
                  }
            }
          >
            <Box
              component="main"
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-evenly"}
              justifyItems={"center"}
            >
              <Box mb={mobile ? 2 : 8}>
                <img
                  src="exaApp.svg"
                  width={mobile ? 125 : 168}
                  style={{ marginBottom: mobile ? 32 : 64 }}
                />
                <Typography fontSize={16} fontWeight={700} mb={mobile ? 2 : 4}>
                  Decentralize your financial life, today
                </Typography>
                <Box display="flex" flexDirection="column" gap={mobile ? 4 : 7}>
                  <Typography
                    fontWeight={700}
                    lineHeight={mobile ? "40px" : "50px"}
                    sx={mobile ? { fontSize: 32 } : { fontSize: 44 }}
                  >
                    The first self-custodial digital credit card
                  </Typography>
                  <Typography fontSize={mobile ? 14 : 16}>
                    Buy now, pay later, and hold your crypto.*
                  </Typography>

                  <Box
                    display="flex"
                    gap={2}
                    flexDirection={mobile ? "column" : "row"}
                  >
                    <Button
                      href="https://docs.google.com/forms/d/e/1FAIpQLSer9ldKEw9mFmImaBxkJzSBwIVY63-dJAObRlfF7zVnZk1KFQ/viewform?usp=sf_link"
                      variant="contained"
                      fullWidth={!!mobile}
                      target="_blank"
                    >
                      Join the waitlist
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth={!!mobile}
                      href="https://twitter.com/Exa_App"
                      target="_blank"
                      sx={{
                        display: "flex",
                        gap: 0.75,
                      }}
                    >
                      Follow us on <img src="x.svg" width={12} />
                    </Button>
                  </Box>
                  {!mobile && (
                    <Box position="absolute" bottom={40} color="grey.300">
                      <Typography fontSize={12}>{COPYRIGHT}</Typography>
                      <Link href={"/t&c"} style={{ fontSize: 12 }}>
                        Terms and Conditions
                      </Link>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            <Box>
              <Box
                className={styles.marquee}
                sx={{
                  backgroundColor: "#303336",
                }}
                position={mobile ? "fixed" : "absolute"}
                bottom={mobile && 0}
                zIndex={mobile ? 3 : 0}
              >
                <Typography
                  sx={{
                    fontSize: mobile ? 24 : 44,
                    fontWeight: 200,
                    fontFamily: "Bebas Neue",
                  }}
                >
                  {`• Pay in up-to 12 installments • On-chain secured transactions • Multiple digital credit cards • Earn interest on deposited assets • Cashback • Borrow at low interest rates • Deposit and borrow on-chain`}
                  {`• Pay in up-to 12 installments • On-chain secured transactions • Multiple digital credit cards • Earn interest on deposited assets • Cashback • Borrow at low interest rates • Deposit and borrow on-chain`}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            display="flex"
            justifyContent="center"
            zIndex={2}
            sx={mobile ? {} : { flexGrow: 1 }}
            maxWidth={580}
            flexDirection="column"
            width={mobile ? "100%" : undefined}
          >
            <img src="card-black-and-white.svg" width={mobile ? 364 : "100%"} />
            {mobile ? (
              <Box display="flex" justifyContent="space-between" mb={6}>
                <Box color="grey.300">
                  <Typography fontSize={12}>{COPYRIGHT}</Typography>
                  <Link href={"/t&c"} style={{ fontSize: 12 }}>
                    Terms and Conditions
                  </Link>
                </Box>

                <Typography color="grey.300" fontSize={12}>
                  *The credit is powered by Exactly Protocol.
                </Typography>
              </Box>
            ) : (
              <Typography
                color="grey.300"
                fontSize={12}
                position="absolute"
                bottom={40}
                right={40}
              >
                *The credit is powered by{" "}
                <a href="https://exact.ly/" target="_blank">
                  Exactly Protocol
                </a>
                .
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
