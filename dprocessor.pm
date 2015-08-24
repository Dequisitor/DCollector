package dprocessor;

sub init {
}

sub handleRequest {
	my $handle = $_[1];
	my $reqType = $_[2];
	my $reqPath = "DCollector/public" . $_[3];
	my $reqBody = $_[4];
	print "request: $reqType $reqPath\n";

	if ($reqType eq "GET") {
		my @reqPieces = split("/", $_[3]);

		#main page
		if (@reqPieces == 0) {
			print $handle "HTTP/1.1 307 REDIRECT\r\n";
			print $handle "Location: /" . __PACKAGE__ . "/views/dprocessor.html\r\n\r\n";
			return "OK";
		}

		#list data entries
		if ($_[3] eq "/getLatest") {
			my $result = `cd DCollector/public/data;ls;`;
			$result =~ s/\n/\ /g; #change line feeds to spaces
			$result =~ s/\s$//g; #remove trailing whitespaces
			my @files = split(" ", $result);

			my $JSON = "[";
			foreach $entry (@files) {
				open(my $fh, "<DCollector/public/data/$entry");
				my $last = (split(/\{\"timeStamp.+\}\]\},/, <$fh>))[-1];
				$last =~ s/}]}.*/}]}/;
				close($fh);

				$JSON .= "{\"fileName\": \"$entry\", \"data\": $last},";
			}
			$JSON =~ s/},$/}]/;

			print $handle $JSON;
			return "OK";
		}

		#get files
		if (-e $reqPath) {
			print $handle "HTTP/1.1 200 OK\r\n\r\n";
			open(my $file, "<".$reqPath);
			while (<$file>) {
				print $handle $_;
			}
			close $file;
			return "OK";
		}
	}
	return "unable to find requested file";
}
1;
