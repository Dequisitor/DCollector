package dcollector;

sub init {
}

sub stringifyJSON{
	my $json = $_[0];
	my $indent = 0;
	my $prevchar = "\t";
	for my $c (split(//, $json)) {
		if ($c eq "}" or $c eq "]") {
			print "\n";
			$indent--;
			if ($indent < 0) {
				$indent = 0;
			}
			for (my $i=0; $i<$indent; $i++) {
				print "\t";
			}
			print "$c";
			next;
		}

		if ($c eq "{" or $c eq "[") {
			if ($prevchar ne "\t") {
				print "\n";
				for (my $i=0; $i<$indent; $i++) {
					print "\t";
				}
			}
			print "$c\n";
			$indent++;
			for (my $i=0; $i<$indent; $i++) {
				print "\t";
				$c = "\t";
			}
			next;
		}

		if ($c eq ",") {
			print "$c\n";
			for (my $i=0; $i<$indent; $i++) {
				print "\t";
				$c = "\t";
			}
			next;
		}

		print $c;
	} continue {
		$prevchar = $c;
	}
	print "\n";
}

sub handleRequest {
	my $handle = $_[1];
	my $reqType = $_[2];
	my $reqPath = "DCollector/public" . $_[3];
	my $reqBody = $_[4];
	print "request: $reqType $reqPath\n";

	#handle POST
	if ($reqType eq "POST") {
		(my $fileName = $reqBody) =~ s/^.*"file":"(.+?)".*$/$1/g;
		(my $data = $reqBody) =~ s/^.*"data":(\[.+?\]).*$/$1/g;
		print "selected file is $fileName\n";
		#print "sent data: $data\n";

		if (-e "DCollector/public/data/$fileName") {
			my $json = do {
				local $/ = undef;
				open(my $fh, "<DCollector/public/data/$fileName");
				<$fh>;
			};
			my ($sec, $min, $hour, $mday, $mon, $year, $wday, $yday, $isdst) = localtime();
			my $timeStamp = sprintf("%04d-%02d-%02dT%02d:%02d:%02d.000Z", $year+1900, $mon+1, $mday, $hour, $min, $sec); 
			$json =~ s/(.*?)\]$/$1,{"timeStamp":"$timeStamp","data":$data\}\]/g;
			
			#stringifyJSON($json);
			open(my $fh, ">DCollector/public/data/$fileName");
			print $fh $json;
			close($fh);

			print $handle "HTTP/1.1 200 OK\r\n\r\n";
			return "OK";
		} else {
			return "ERROR: $fileName not found\n";
		}
	}

	if ($reqType eq "GET") {
		my @reqPieces = split("/", $_[3]);

		#main page
		if (@reqPieces == 0) {
			print $handle "HTTP/1.1 307 REDIRECT\r\n";
			print $handle "Location: /" . __PACKAGE__ . "/views/dcollector.html\r\n\r\n";
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
